import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { FetchClientsOnlineUseCase } from './fetch-clients-online'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: FetchClientsOnlineUseCase

describe('Fetch Invoices', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		sut = new FetchClientsOnlineUseCase(inMemoryClientsRepository)
	})

	it('Should be able to fetch clients', async () => {
		const client1 = makeClient()
		await inMemoryClientsRepository.create(client1)

		const client2 = makeClient()
		await inMemoryClientsRepository.create(client2)

		const client3 = makeClient()
		await inMemoryClientsRepository.create(client3)

		const clientIds = [
			client1.id.toString(),
			client2.id.toString(),
			client3.id.toString(),
		]

		const result = await sut.execute({
			page: 1,
			clientIds,
		})

		expect(result.value?.clients).toHaveLength(3)
	})

	it('Should be able to fetch paginated clients', async () => {
		const clientIds: string[] = []
		for (let i = 1; i <= 22; i++) {
			const client = makeClient()
			clientIds.push(client.id.toString())
			await inMemoryClientsRepository.create(client)
		}

		const result = await sut.execute({
			page: 2,
			clientIds,
		})

		expect(result.value?.clients).toHaveLength(10)
	})
})
