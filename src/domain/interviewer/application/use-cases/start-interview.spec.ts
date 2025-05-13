import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import { StartInterviewUseCase } from './start-interview'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: StartInterviewUseCase

describe('Start Interview', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new StartInterviewUseCase(inMemoryInterviewsRepository)
	})

	it('Should be able to send contract in interview', async () => {
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
})
