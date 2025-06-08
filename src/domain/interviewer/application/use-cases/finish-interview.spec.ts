import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import { FinishInterviewUseCase } from './finish-interview'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: FinishInterviewUseCase

describe('Finish Interview', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new FinishInterviewUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to finish interview', async () => {
		const interviewPending = makeInterview({
			status: STATUS_INTERVIEW.PENDING,
		})

		inMemoryInterviewsRepository.create(interviewPending)

		interviewPending.changeStatus(STATUS_INTERVIEW.PENDING)

		const result = await sut.execute({
			interviewId: interviewPending.id.toString(),
		})

		console.log(result)

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(STATUS_INTERVIEW.COMPLETED)
		}
	})

	it('Should be able throw an error if interview is not found', async () => {
		const interviewScheduled = makeInterview()

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('Should be able throw an error if interview status is different from PENDING', async () => {
		const interviewScheduled = makeInterview()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		inMemoryInterviewsRepository.create(interviewScheduled)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
