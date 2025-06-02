import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import { SendContractUseCase } from './send-contract'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: SendContractUseCase

describe('Send Contract', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new SendContractUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to send contract in interview', async () => {
		const interviewInProgress = makeInterview()

		inMemoryInterviewsRepository.create(interviewInProgress)

		interviewInProgress.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		const result = await sut.execute({
			interviewId: interviewInProgress.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(STATUS_INTERVIEW.PENDING)
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

	it('Should be able throw an error if interview status is different from IN_PROGRESS', async () => {
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
