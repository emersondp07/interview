import { STATUS_APPOINTMENT } from '@/domain/client/entities/interfaces/appointment.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeAppointment } from '@/tests/factories/make-appointment'
import { InMemoryAppointmentsRepository } from '@/tests/repositories/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CancelAppointmentUseCase } from './cancel-appointment'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let sut: CancelAppointmentUseCase

describe('Cancel Appointment Use Case', () => {
	beforeEach(() => {
		inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
		sut = new CancelAppointmentUseCase(inMemoryAppointmentsRepository)
	})

	it('should be able to cancel an appointment', async () => {
		const appointment = makeAppointment()

		await inMemoryAppointmentsRepository.create(appointment)

		const result = await sut.execute({
			appointmentId: appointment.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(inMemoryAppointmentsRepository.items[0].status).toBe(
			STATUS_APPOINTMENT.CANCELED,
		)
		expect(inMemoryAppointmentsRepository.items[0].deletedAt).toBeInstanceOf(
			Date,
		)
	})

	it('should return error when appointment does not exist', async () => {
		const result = await sut.execute({
			appointmentId: 'invalid-id',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
