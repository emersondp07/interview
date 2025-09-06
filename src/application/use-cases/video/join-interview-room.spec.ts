import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import { makeInterviewRoom } from '@/tests/factories/make-interview-room'
import { InMemoryVideoSessionRepository } from '@/tests/repositories/in-memory-video-session-repository'
import { MockRecordingService } from '@/tests/repositories/mock-recording-service'
import { faker } from '@faker-js/faker'
import { JoinInterviewRoomUseCase } from './join-interview-room'

let inMemoryVideoSessionRepository: InMemoryVideoSessionRepository
let mockRecordingService: MockRecordingService
let sut: JoinInterviewRoomUseCase

describe('JoinInterviewRoomUseCase', () => {
	beforeEach(() => {
		inMemoryVideoSessionRepository = new InMemoryVideoSessionRepository()
		mockRecordingService = new MockRecordingService()
		sut = new JoinInterviewRoomUseCase(
			inMemoryVideoSessionRepository,
			mockRecordingService,
		)
	})

	it('should be able to create a new interview room and join as doctor', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		const result = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId,
		})

		expect(result.success).toBe(true)
		expect(result.room?.interviewId).toBe(interviewId)
		expect(result.room?.doctorSocketId).toBe(socketId)
		expect(result.roomInfo?.isRecording).toBe(true) // Should start recording when doctor joins
		expect(result.roomInfo?.participantCount).toBe(1)
		expect(mockRecordingService.recordingStartedCalls).toHaveLength(1)
	})

	it('should be able to join an existing room as patient', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const patientSocketId = faker.string.uuid()

		// Create existing room
		const room = makeInterviewRoom({ interviewId, patientId, doctorId })
		inMemoryVideoSessionRepository.save(room)

		const result = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.CLIENT,
			socketId: patientSocketId,
		})

		expect(result.success).toBe(true)
		expect(result.room?.patientSocketId).toBe(patientSocketId)
		expect(result.roomInfo?.participantCount).toBe(1)
		expect(mockRecordingService.recordingStartedCalls).toHaveLength(0) // No recording started for patient
	})

	it('should be able to join room with both participants', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const doctorSocketId = faker.string.uuid()
		const patientSocketId = faker.string.uuid()

		// First, doctor joins
		const doctorResult = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId: doctorSocketId,
		})

		expect(doctorResult.success).toBe(true)
		expect(doctorResult.roomInfo?.participantCount).toBe(1)

		// Then, patient joins
		const patientResult = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.CLIENT,
			socketId: patientSocketId,
		})

		expect(patientResult.success).toBe(true)
		expect(patientResult.roomInfo?.participantCount).toBe(2)
	})

	it('should not allow unauthorized doctor to join room', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const authorizedDoctorId = faker.string.uuid()
		const unauthorizedDoctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room for authorized doctor
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId, 
			doctorId: authorizedDoctorId 
		})
		inMemoryVideoSessionRepository.save(room)

		const result = await sut.execute({
			interviewId,
			patientId,
			doctorId: unauthorizedDoctorId,
			role: ROLE.INTERVIEWER,
			socketId,
		})

		expect(result.success).toBe(false)
		expect(result.error).toBe('Não autorizado para esta entrevista')
	})

	it('should not allow unauthorized patient to join room', async () => {
		const interviewId = faker.string.uuid()
		const authorizedPatientId = faker.string.uuid()
		const unauthorizedPatientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// Create room for authorized patient
		const room = makeInterviewRoom({ 
			interviewId, 
			patientId: authorizedPatientId, 
			doctorId 
		})
		inMemoryVideoSessionRepository.save(room)

		const result = await sut.execute({
			interviewId,
			patientId: unauthorizedPatientId,
			doctorId,
			role: ROLE.CLIENT,
			socketId,
		})

		expect(result.success).toBe(false)
		expect(result.error).toBe('Não autorizado para esta entrevista')
	})

	it('should not allow second doctor to join same room', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const firstDoctorSocketId = faker.string.uuid()
		const secondDoctorSocketId = faker.string.uuid()

		// First doctor joins
		await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId: firstDoctorSocketId,
		})

		// Second doctor tries to join
		const result = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId: secondDoctorSocketId,
		})

		expect(result.success).toBe(false)
		expect(result.error).toBe('Doutor já está conectado nesta entrevista')
	})

	it('should not allow second patient to join same room', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const firstPatientSocketId = faker.string.uuid()
		const secondPatientSocketId = faker.string.uuid()

		// First patient joins
		await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.CLIENT,
			socketId: firstPatientSocketId,
		})

		// Second patient tries to join
		const result = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.CLIENT,
			socketId: secondPatientSocketId,
		})

		expect(result.success).toBe(false)
		expect(result.error).toBe('Paciente já está conectado nesta entrevista')
	})

	it('should allow same socket to rejoin room', async () => {
		const interviewId = faker.string.uuid()
		const patientId = faker.string.uuid()
		const doctorId = faker.string.uuid()
		const socketId = faker.string.uuid()

		// First join
		const firstResult = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId,
		})

		expect(firstResult.success).toBe(true)

		// Rejoin with same socket
		const secondResult = await sut.execute({
			interviewId,
			patientId,
			doctorId,
			role: ROLE.INTERVIEWER,
			socketId,
		})

		expect(secondResult.success).toBe(true)
	})
})