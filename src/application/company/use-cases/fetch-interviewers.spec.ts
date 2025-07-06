import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { FetchInterviewersUseCase } from './fetch-interviewers'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let sut: FetchInterviewersUseCase

describe('Fetch Interviewers', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		sut = new FetchInterviewersUseCase(inMemoryInterviewersRepository)
	})

	it('Should be able to fetch interviewers', async () => {
		await inMemoryInterviewersRepository.create(makeInterviewer())
		await inMemoryInterviewersRepository.create(makeInterviewer())
		await inMemoryInterviewersRepository.create(makeInterviewer())

		const result = await sut.execute({
			page: 1,
		})

		expect(result.value?.interviewers).toHaveLength(3)
	})

	it('Should be able to fetch paginated interviewers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryInterviewersRepository.create(makeInterviewer())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.value?.interviewers).toHaveLength(10)
	})
})
