import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
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
})
