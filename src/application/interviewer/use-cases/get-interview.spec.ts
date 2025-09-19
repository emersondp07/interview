import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { GetInterviewByIdUseCase } from './get-interview'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: GetInterviewByIdUseCase

describe('Get Interview', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()

		sut = new GetInterviewByIdUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to get an interview by id', async () => {
		const interview = makeInterview()

		await inMemoryInterviewsRepository.create(interview)

		const result = await sut.execute({
			interviewId: interview.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)

		if (result.isSuccess()) {
			expect(result.value.interview?.id).toEqual(interview.id)
			expect(result.value.interview?.status).toEqual(interview.status)
			expect(result.value.interview?.clientId).toEqual(interview.clientId)
			expect(result.value.interview?.interviewerId).toEqual(
				interview.interviewerId,
			)
		}
	})

	it('Should not be able to get an interview with invalid id', async () => {
		const result = await sut.execute({
			interviewId: 'invalid-interview-id',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
