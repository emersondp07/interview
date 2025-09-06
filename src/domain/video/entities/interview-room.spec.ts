import { faker } from '@faker-js/faker'
import { makeInterviewRoom } from '../../../tests/factories/make-interview-room'
import { InterviewRoom } from './interview-room'

describe('InterviewRoom Entity', () => {
	it('should be able to create an interview room with valid data', () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()

		const room = InterviewRoom.create(interviewId, patientId, doctorId)

		expect(room.interviewId).toBe(interviewId)
		expect(room.patientId).toBe(patientId)
		expect(room.doctorId).toBe(doctorId)
		expect(room.isRecording).toBe(false)
		expect(room.doctorSocketId).toBeUndefined()
		expect(room.patientSocketId).toBeUndefined()
		expect(room.getParticipantCount()).toBe(0)
	})

	it('should be able to set and clear doctor socket', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()

		room.setDoctorSocket(socketId)
		expect(room.doctorSocketId).toBe(socketId)
		expect(room.getParticipantCount()).toBe(1)

		room.clearDoctorSocket()
		expect(room.doctorSocketId).toBeUndefined()
		expect(room.getParticipantCount()).toBe(0)
	})

	it('should be able to set and clear patient socket', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()

		room.setPatientSocket(socketId)
		expect(room.patientSocketId).toBe(socketId)
		expect(room.getParticipantCount()).toBe(1)

		room.clearPatientSocket()
		expect(room.patientSocketId).toBeUndefined()
		expect(room.getParticipantCount()).toBe(0)
	})

	it('should be able to get other socket id', () => {
		const room = makeInterviewRoom()
		const doctorSocketId = faker.string.uuid()
		const patientSocketId = faker.string.uuid()

		room.setDoctorSocket(doctorSocketId)
		room.setPatientSocket(patientSocketId)

		expect(room.getOtherSocketId(doctorSocketId)).toBe(patientSocketId)
		expect(room.getOtherSocketId(patientSocketId)).toBe(doctorSocketId)
		expect(room.getOtherSocketId(faker.string.uuid())).toBe(doctorSocketId)
	})

	it('should correctly identify when room has no participants', () => {
		const room = makeInterviewRoom()

		expect(room.hasNoParticipants()).toBe(true)

		room.setDoctorSocket(faker.string.uuid())
		expect(room.hasNoParticipants()).toBe(false)

		room.setPatientSocket(faker.string.uuid())
		expect(room.hasNoParticipants()).toBe(false)

		room.clearDoctorSocket()
		expect(room.hasNoParticipants()).toBe(false)

		room.clearPatientSocket()
		expect(room.hasNoParticipants()).toBe(true)
	})

	it('should be able to manage producers correctly', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()
		const mockProducer = {
			id: faker.string.uuid(),
			kind: 'video',
			close: vi.fn(),
		} as any

		expect(room.getProducers(socketId)).toEqual([])

		room.addProducer(socketId, mockProducer)
		expect(room.getProducers(socketId)).toContain(mockProducer)

		room.removeProducer(socketId, mockProducer.id)
		expect(room.getProducers(socketId)).toEqual([])
	})

	it('should be able to manage consumers correctly', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()
		const mockConsumer = {
			id: faker.string.uuid(),
			kind: 'video',
			close: vi.fn(),
		} as any

		expect(room.getConsumers(socketId)).toEqual([])

		room.addConsumer(socketId, mockConsumer)
		expect(room.getConsumers(socketId)).toContain(mockConsumer)

		room.removeConsumer(socketId, mockConsumer.id)
		expect(room.getConsumers(socketId)).toEqual([])
	})

	it('should be able to manage transports correctly', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()
		const mockTransport = {
			id: faker.string.uuid(),
			close: vi.fn(),
		} as any

		expect(room.getProducerTransport(socketId)).toBeUndefined()
		expect(room.getConsumerTransport(socketId)).toBeUndefined()

		room.setProducerTransport(socketId, mockTransport)
		expect(room.getProducerTransport(socketId)).toBe(mockTransport)

		room.setConsumerTransport(socketId, mockTransport)
		expect(room.getConsumerTransport(socketId)).toBe(mockTransport)
	})

	it('should be able to clear all socket resources', () => {
		const room = makeInterviewRoom()
		const socketId = faker.string.uuid()
		
		const mockProducer = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockConsumer = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockProducerTransport = { id: faker.string.uuid(), close: vi.fn() } as any
		const mockConsumerTransport = { id: faker.string.uuid(), close: vi.fn() } as any

		room.setDoctorSocket(socketId)
		room.addProducer(socketId, mockProducer)
		room.addConsumer(socketId, mockConsumer)
		room.setProducerTransport(socketId, mockProducerTransport)
		room.setConsumerTransport(socketId, mockConsumerTransport)

		room.clearSocket(socketId)

		expect(room.doctorSocketId).toBeUndefined()
		expect(room.getProducers(socketId)).toEqual([])
		expect(room.getConsumers(socketId)).toEqual([])
		expect(room.getProducerTransport(socketId)).toBeUndefined()
		expect(room.getConsumerTransport(socketId)).toBeUndefined()
		expect(mockProducer.close).toHaveBeenCalled()
		expect(mockConsumer.close).toHaveBeenCalled()
		expect(mockProducerTransport.close).toHaveBeenCalled()
		expect(mockConsumerTransport.close).toHaveBeenCalled()
	})
})