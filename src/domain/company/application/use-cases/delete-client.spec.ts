import { UniqueEntityID } from '@/core/entities/unique-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { DeleteClientUseCase } from './delete-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: DeleteClientUseCase

describe('Delete Client', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()

		sut = new DeleteClientUseCase(inMemoryClientsRepository)
	})

	it('Should be able to delete a client', async () => {
		const client = makeClient()

		await inMemoryClientsRepository.create(client)

		await sut.execute({
			clientId: client.id.toString(),
		})

		expect(inMemoryClientsRepository.items).toHaveLength(0)
	})

	it('Should not be able to delete a client if is not exist', async () => {
		const client = makeClient(
			{ companyId: new UniqueEntityID('company-1') },
			new UniqueEntityID('client-1'),
		)

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: 'client-2',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
