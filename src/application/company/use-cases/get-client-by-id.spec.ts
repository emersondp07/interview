import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { GetClientByIdUseCase } from './get-client-by-id'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: GetClientByIdUseCase

describe('Get Client By Id', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

		sut = new GetClientByIdUseCase(
			inMemoryClientsRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to get a client by id', async () => {
		const client = makeClient()

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: client.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)

		if (result.isSuccess()) {
			expect(result.value.client?.id).toEqual(client.id)
		}
	})

	it('Should not be able to get a client with invalid id', async () => {
		const result = await sut.execute({
			clientId: 'invalid-client-id',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
