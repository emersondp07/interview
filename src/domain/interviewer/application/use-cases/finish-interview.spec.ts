import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
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
		const interviewPending = makeInterview()

		inMemoryInterviewsRepository.create(interviewPending)

		interviewPending.changeStatus(STATUS_INTERVIEW.PENDING)

		const result = await sut.execute({
			interviewId: interviewPending.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(STATUS_INTERVIEW.COMPLETED)
		}
	})
})
