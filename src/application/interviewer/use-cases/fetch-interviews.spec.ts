import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { FetchInterviewsUseCase } from './fetch-interviews'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: FetchInterviewsUseCase

describe('Fetch Interviews', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new FetchInterviewsUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to fetch plans', async () => {
		await inMemoryInterviewsRepository.create(makeInterview())
		await inMemoryInterviewsRepository.create(makeInterview())
		await inMemoryInterviewsRepository.create(makeInterview())

		const result = await sut.execute({
			page: 1,
		})

		expect(result.value?.interviews).toHaveLength(3)
	})

	it('Should be able to fetch paginated plans', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryInterviewsRepository.create(makeInterview())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.value?.interviews).toHaveLength(10)
	})
})
