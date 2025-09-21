import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { makeAppointment } from '@/tests/factories/make-appointment'
import { InMemoryAppointmentsRepository } from '@/tests/repositories/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchAppointmentsByClientUseCase } from './fetch-appointments-by-client'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let sut: FetchAppointmentsByClientUseCase

describe('Fetch Appointments By Client Use Case', () => {
	beforeEach(() => {
		inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
		sut = new FetchAppointmentsByClientUseCase(inMemoryAppointmentsRepository)
	})

	it('should be able to fetch client appointments', async () => {
		const clientId = new UniqueEntityID('client-1')
		const anotherClientId = new UniqueEntityID('client-2')

		const appointment1 = makeAppointment({ clientId })
		const appointment2 = makeAppointment({ clientId })
		const appointment3 = makeAppointment({ clientId: anotherClientId })

		await inMemoryAppointmentsRepository.create(appointment1)
		await inMemoryAppointmentsRepository.create(appointment2)
		await inMemoryAppointmentsRepository.create(appointment3)

		const result = await sut.execute({
			clientId: clientId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointments: expect.arrayContaining([
				expect.objectContaining({ id: appointment1.id }),
				expect.objectContaining({ id: appointment2.id }),
			]),
		})
		expect(result.value?.appointments).toHaveLength(2)
	})

	it('should return empty array when client has no appointments', async () => {
		const result = await sut.execute({
			clientId: 'client-without-appointments',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			appointments: [],
		})
	})
})
