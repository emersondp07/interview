import {
	SPECIALTIES,
	STATUS_APPOINTMENT,
} from '@/domain/client/entities/interfaces/appointment.type'
import { InMemoryAppointmentsRepository } from '@/tests/repositories/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateAppointmentUseCase } from './create-appointment'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let sut: CreateAppointmentUseCase

describe('Create Appointment Use Case', () => {
	beforeEach(() => {
		inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
		sut = new CreateAppointmentUseCase(inMemoryAppointmentsRepository)
	})

	it('should be able to create an appointment', async () => {
		const scheduledAt = new Date('2024-10-01T10:00:00Z')

		const result = await sut.execute({
			clientId: 'client-1',
			scheduledAt,
			specialty: SPECIALTIES.CARDIOLOGIA,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointment: expect.objectContaining({
				status: STATUS_APPOINTMENT.SCHEDULED,
				scheduledAt,
				specialty: SPECIALTIES.CARDIOLOGIA,
			}),
		})
		expect(inMemoryAppointmentsRepository.items).toHaveLength(1)
	})

	it('should be able to create an appointment with assigned interviewer', async () => {
		const scheduledAt = new Date('2024-10-01T14:00:00Z')

		const result = await sut.execute({
			clientId: 'client-1',
			scheduledAt,
			specialty: SPECIALTIES.CLINICA_GERAL,
			interviewerId: 'interviewer-1',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointment: expect.objectContaining({
				interviewerId: expect.any(Object),
			}),
		})
	})
})
