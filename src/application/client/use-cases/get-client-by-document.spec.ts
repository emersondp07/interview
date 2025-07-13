import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { GetClientByDocumentUseCase } from './get-client-by-document'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: GetClientByDocumentUseCase

describe('Get Client By Document', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()

		sut = new GetClientByDocumentUseCase(inMemoryClientsRepository)
	})

	it('Should be able to get a client by document', async () => {
		const client = makeClient()

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			document: client.document,
		})

		expect(result.isSuccess()).toBe(true)
	})

	it('Should not be able to get a client by document', async () => {
		const client = makeClient()

		const result = await sut.execute({
			document: client.document,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
