import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { Appointment } from './appointment'
import { SPECIALTIES, STATUS_APPOINTMENT } from './interfaces/appointment.type'

describe('Appointment Entity', () => {
	it('Should be able to create an appointment with valid data', () => {
		const clientId = new UniqueEntityID()
		const scheduledAt = faker.date.future()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt,
			clientId,
			specialty: SPECIALTIES.CLINICA_GERAL,
		})

		expect(appointment.id).toBeInstanceOf(UniqueEntityID)
		expect(appointment.status).toBe(STATUS_APPOINTMENT.SCHEDULED)
		expect(appointment.scheduledAt).toBe(scheduledAt)
		expect(appointment.clientId).toBe(clientId)
		expect(appointment.specialty).toBe(SPECIALTIES.CLINICA_GERAL)
		expect(appointment.createdAt).toBeInstanceOf(Date)
		expect(appointment.updatedAt).toBeInstanceOf(Date)
		expect(appointment.interviewerId).toBeUndefined()
		expect(appointment.triageId).toBeUndefined()
		expect(appointment.interviewId).toBeUndefined()
		expect(appointment.deletedAt).toBeUndefined()
	})

	it('Should be able to change the status of an appointment', async () => {
		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.CARDIOLOGIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.changeStatus(STATUS_APPOINTMENT.IN_PROGRESS)

		expect(appointment.status).toBe(STATUS_APPOINTMENT.IN_PROGRESS)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to reschedule an appointment', async () => {
		const originalDate = faker.date.future()
		const newDate = faker.date.future()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: originalDate,
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.NEUROLOGIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.reschedule(newDate)

		expect(appointment.scheduledAt).toBe(newDate)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign an interviewer to an appointment', async () => {
		const interviewerId = new UniqueEntityID()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.PSIQUIATRIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.assignInterviewer(interviewerId)

		expect(appointment.interviewerId).toBe(interviewerId)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign a triage to an appointment', async () => {
		const triageId = new UniqueEntityID()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.ORTOPEDIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.assignTriage(triageId)

		expect(appointment.triageId).toBe(triageId)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign an interview to an appointment', async () => {
		const interviewId = new UniqueEntityID()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.GINECOLOGIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.assignInterview(interviewId)

		expect(appointment.interviewId).toBe(interviewId)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to cancel an appointment', async () => {
		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.DERMATOLOGIA,
		})

		const oldUpdatedAt = appointment.updatedAt

		await delay(10)

		appointment.cancel()

		expect(appointment.status).toBe(STATUS_APPOINTMENT.CANCELED)
		expect(appointment.deletedAt).toBeInstanceOf(Date)
		expect(appointment.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to create an appointment with all optional properties', () => {
		const clientId = new UniqueEntityID()
		const interviewerId = new UniqueEntityID()
		const triageId = new UniqueEntityID()
		const interviewId = new UniqueEntityID()
		const scheduledAt = faker.date.future()

		const appointment = Appointment.create({
			status: STATUS_APPOINTMENT.IN_PROGRESS,
			scheduledAt,
			clientId,
			interviewerId,
			specialty: SPECIALTIES.MEDICINA_DO_TRABALHO,
			triageId,
			interviewId,
		})

		expect(appointment.status).toBe(STATUS_APPOINTMENT.IN_PROGRESS)
		expect(appointment.clientId).toBe(clientId)
		expect(appointment.interviewerId).toBe(interviewerId)
		expect(appointment.specialty).toBe(SPECIALTIES.MEDICINA_DO_TRABALHO)
		expect(appointment.triageId).toBe(triageId)
		expect(appointment.interviewId).toBe(interviewId)
		expect(appointment.scheduledAt).toBe(scheduledAt)
	})
})
