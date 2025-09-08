import { makeInterviewRoom } from '@/tests/factories/make-interview-room'
import { InMemoryVideoSessionRepository } from '@/tests/repositories/in-memory-video-session-repository'
import { MockRecordingService } from '@/tests/repositories/mock-recording-service'
import { faker } from '@faker-js/faker'
import { HandleDisconnectUseCase } from './handle-disconnect'

let inMemoryVideoSessionRepository: InMemoryVideoSessionRepository
let mockRecordingService: MockRecordingService
let sut: HandleDisconnectUseCase

describe('HandleDisconnectUseCase', () => {
	beforeEach(() => {
		inMemoryVideoSessionRepository = new InMemoryVideoSessionRepository()
		mockRecordingService = new MockRecordingService()
		sut = new HandleDisconnectUseCase(
			inMemoryVideoSessionRepository,
			mockRecordingService,
		)
	})

	it('should handle disconnect when socket is not in any room', async () => {
		const socketId = faker.string.uuid()

		const result = await sut.execute({ socketId })

		expect(result.roomCleaned).toBe(false)
		expect(result.otherSocketId).toBeUndefined()
	})

	it('should handle disconnect when room is not found', async () => {
		const interviewId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Set socket mapping but don't create room
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.roomCleaned).toBe(false)
		expect(result.otherSocketId).toBeUndefined()
		expect(inMemoryVideoSessionRepository.getSocketRoom(socketId)).toBeUndefined()
	})

	it('should clean up room when last participant disconnects', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room with recording and one participant
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId, 
			doctorId,
			isRecording: true,
			recordingStartTime: new Date(),
			doctorSocketId: socketId
		})
		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.roomCleaned).toBe(true)
		expect(result.otherSocketId).toBeUndefined()
		expect(inMemoryVideoSessionRepository.findById(interviewId)).toBeUndefined()
		expect(mockRecordingService.recordingStoppedCalls).toHaveLength(1)
	})

	it('should notify other participant when one disconnects', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const doctorSocketId = faker.string.uuid()
		const patientSocketId = faker.string.uuid()

		// Create room with both participants
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId, 
			doctorId,
			doctorSocketId,
			patientSocketId
		})
		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(doctorSocketId, interviewId)

		const result = await sut.execute({ socketId: doctorSocketId })

		expect(result.roomCleaned).toBe(false)
		expect(result.otherSocketId).toBe(patientSocketId)
		expect(inMemoryVideoSessionRepository.findById(interviewId)).toBeDefined()
		
		// Room should still exist
		const updatedRoom = inMemoryVideoSessionRepository.findById(interviewId)
		expect(updatedRoom?.doctorSocketId).toBeUndefined()
		expect(updatedRoom?.patientSocketId).toBe(patientSocketId)
	})

	it('should clear socket resources properly', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()
		const otherSocketId = faker.string.uuid()

		// Create room with mock resources
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId, 
			doctorId,
			doctorSocketId: socketId,
			patientSocketId: otherSocketId
		})

		// Add mock resources
		const mockProducer = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockConsumer = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockProducerTransport = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockConsumerTransport = { id: faker.string.uuid(), close: vi.fn() } as any

		room.addProducer(socketId, mockProducer)
		room.addConsumer(socketId, mockConsumer)
		room.setProducerTransport(socketId, mockProducerTransport)
		room.setConsumerTransport(socketId, mockConsumerTransport)

		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.roomCleaned).toBe(false)
		expect(result.otherSocketId).toBe(otherSocketId)
		
		// Check that resources were closed
		expect(mockProducer.close).toHaveBeenCalled()
		expect(mockConsumer.close).toHaveBeenCalled()
		expect(mockProducerTransport.close).toHaveBeenCalled()
		expect(mockConsumerTransport.close).toHaveBeenCalled()

		// Check that socket was cleared from room
		const updatedRoom = inMemoryVideoSessionRepository.findById(interviewId)
		expect(updatedRoom?.doctorSocketId).toBeUndefined()
		expect(updatedRoom?.getProducers(socketId)).toEqual([])
		expect(updatedRoom?.getConsumers(socketId)).toEqual([])
	})

	it('should stop recording when no participants remain', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room with recording but no recording initially started
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId, 
			doctorId,
			isRecording: false,
			doctorSocketId: socketId
		})

		// Start recording manually
		room.startRecording('/mock/path.mp4')
		
		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.roomCleaned).toBe(true)
		expect(mockRecordingService.recordingStoppedCalls).toHaveLength(1)
	})
})