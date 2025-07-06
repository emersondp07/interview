import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { FetchPlansUseCase } from './fetch-plans'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: FetchPlansUseCase

describe('Fetch Plans', () => {
	beforeEach(() => {
		inMemoryPlansRepository = new InMemoryPlansRepository()
		sut = new FetchPlansUseCase(inMemoryPlansRepository)
	})

	it('Should be able to fetch plans', async () => {
		await inMemoryPlansRepository.create(makePlan())
		await inMemoryPlansRepository.create(makePlan())
		await inMemoryPlansRepository.create(makePlan())

		const result = await sut.execute({
			page: 1,
		})

		expect(result.value?.plans).toHaveLength(3)
	})

	it('Should be able to fetch paginated plans', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryPlansRepository.create(makePlan())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.value?.plans).toHaveLength(10)
	})
})
