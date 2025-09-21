import { makeInterviewRoom } from '@/tests/factories/make-interview-room'
import { InMemoryVideoSessionRepository } from '@/tests/repositories/in-memory-video-session-repository'
import { MockRecordingService } from '@/tests/repositories/mock-recording-service'
import { faker } from '@faker-js/faker'
import { EndInterviewUseCase } from './end-interview'

let inMemoryVideoSessionRepository: InMemoryVideoSessionRepository
let mockRecordingService: MockRecordingService
let sut: EndInterviewUseCase

describe('EndInterviewUseCase', () => {
	beforeEach(() => {
		inMemoryVideoSessionRepository = new InMemoryVideoSessionRepository()
		mockRecordingService = new MockRecordingService()
		sut = new EndInterviewUseCase(
			inMemoryVideoSessionRepository,
			mockRecordingService,
		)
	})

	it('should be able to end interview with recording', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room with recording started a bit ago
		const recordingStartTime = new Date(Date.now() - 1000) // 1 second ago
		const room = makeInterviewRoom({
			interviewId,
			patientId,
			doctorId,
			isRecording: true,
			recordingStartTime,
			recordingPath: '/mock/path/recording.mp4',
		})
		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.success).toBe(true)
		expect(result.recordingInfo).toBeDefined()
		expect(result.recordingInfo?.path).toBe('/mock/path/recording.mp4')
		expect(result.recordingInfo?.duration).toBeGreaterThanOrEqual(1)
		expect(mockRecordingService.recordingStoppedCalls).toHaveLength(1)
	})

	it('should be able to end interview without recording', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room without recording
		const room = makeInterviewRoom({
			interviewId,
			patientId,
			doctorId,
			isRecording: false,
		})
		inMemoryVideoSessionRepository.save(room)
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.success).toBe(true)
		expect(result.recordingInfo).toBeNull()
		expect(mockRecordingService.recordingStoppedCalls).toHaveLength(0)
	})

	it('should return error when socket is not in any room', async () => {
		const socketId = faker.string.uuid()

		const result = await sut.execute({ socketId })

		expect(result.success).toBe(false)
		expect(result.error).toBe('Socket não está em nenhuma sala')
	})

	it('should return error when room is not found', async () => {
		const interviewId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Set socket mapping but don't create room
		inMemoryVideoSessionRepository.setSocketRoom(socketId, interviewId)

		const result = await sut.execute({ socketId })

		expect(result.success).toBe(false)
		expect(result.error).toBe('Sala não encontrada')
	})
})
