import { STATUS_APPOINTMENT } from '@/domain/client/entities/interfaces/appointment.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeAppointment } from '@/tests/factories/make-appointment'
import { InMemoryAppointmentsRepository } from '@/tests/repositories/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateAppointmentStatusUseCase } from './update-appointment-status'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let sut: UpdateAppointmentStatusUseCase

describe('Update Appointment Status Use Case', () => {
	beforeEach(() => {
		inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
		sut = new UpdateAppointmentStatusUseCase(inMemoryAppointmentsRepository)
	})

	it('should be able to update appointment status', async () => {
		const appointment = makeAppointment({
			status: STATUS_APPOINTMENT.SCHEDULED,
		})

		await inMemoryAppointmentsRepository.create(appointment)

		const result = await sut.execute({
			appointmentId: appointment.id.toString(),
			status: STATUS_APPOINTMENT.IN_PROGRESS,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointment: expect.objectContaining({
				status: STATUS_APPOINTMENT.IN_PROGRESS,
			}),
		})
	})

	it('should be able to complete an appointment', async () => {
		const appointment = makeAppointment({
			status: STATUS_APPOINTMENT.IN_PROGRESS,
		})

		await inMemoryAppointmentsRepository.create(appointment)

		const result = await sut.execute({
			appointmentId: appointment.id.toString(),
			status: STATUS_APPOINTMENT.COMPLETED,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointment: expect.objectContaining({
				status: STATUS_APPOINTMENT.COMPLETED,
			}),
		})
	})

	it('should return error when appointment does not exist', async () => {
		const result = await sut.execute({
			appointmentId: 'invalid-id',
			status: STATUS_APPOINTMENT.COMPLETED,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
