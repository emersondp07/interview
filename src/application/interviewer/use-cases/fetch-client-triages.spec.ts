import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { makeTriage } from '@/tests/factories/make-triage'
import { InMemoryTriagesRepository } from '@/tests/repositories/in-memory-triages-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchClientTriagesUseCase } from './fetch-client-triages'

let inMemoryTriagesRepository: InMemoryTriagesRepository
let sut: FetchClientTriagesUseCase

describe('Fetch Client Triages Use Case', () => {
	beforeEach(() => {
		inMemoryTriagesRepository = new InMemoryTriagesRepository()
		sut = new FetchClientTriagesUseCase(inMemoryTriagesRepository)
	})

	it('should be able to fetch client triages', async () => {
		const clientId = new UniqueEntityID('client-1')
		const anotherClientId = new UniqueEntityID('client-2')

		const triage1 = makeTriage({ clientId })
		const triage2 = makeTriage({ clientId })
		const triage3 = makeTriage({ clientId: anotherClientId })

		await inMemoryTriagesRepository.create(triage1)
		await inMemoryTriagesRepository.create(triage2)
		await inMemoryTriagesRepository.create(triage3)

		const result = await sut.execute({
			clientId: clientId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triages: expect.arrayContaining([
				expect.objectContaining({ id: triage1.id }),
				expect.objectContaining({ id: triage2.id }),
			]),
		})
		expect(result.value?.triages).toHaveLength(2)
	})

	it('should return empty array when client has no triages', async () => {
		const result = await sut.execute({
			clientId: 'client-without-triages',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triages: [],
		})
	})
})
