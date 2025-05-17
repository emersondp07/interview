import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import { StartInterviewUseCase } from './start-interview'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: StartInterviewUseCase

describe('Start Interview', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new StartInterviewUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to start interview', async () => {
		const interviewScheduled = makeInterview()

		inMemoryInterviewsRepository.create(interviewScheduled)

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(
				STATUS_INTERVIEW.IN_PROGRESS,
			)
		}
	})

	it('Should be able throw an error if interview is not found', async () => {
		const interviewScheduled = makeInterview()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('Should be able throw an error if interview status is different from SCHEDULED', async () => {
		const interviewScheduled = makeInterview()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		inMemoryInterviewsRepository.create(interviewScheduled)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
