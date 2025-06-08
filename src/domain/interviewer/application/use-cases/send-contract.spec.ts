import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { makeCompany } from '../../../../tests/factories/make-company'
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
		const company = makeCompany()
		const interviewInProgress = makeInterview({
			status: STATUS_INTERVIEW.IN_PROGRESS,
			companyId: company.id,
		})

		inMemoryInterviewsRepository.create(interviewInProgress)

		interviewInProgress.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		const result = await sut.execute({
			interviewId: interviewInProgress.id.toString(),
			companyId: interviewInProgress.companyId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(STATUS_INTERVIEW.PENDING)
		}
	})

	it('Should be able throw an error if interview is not found', async () => {
		const company = makeCompany()
		const interviewScheduled = makeInterview()

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
			companyId: company.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('Should be able throw an error if interview status is different from IN_PROGRESS', async () => {
		const interviewScheduled = makeInterview()
		const company = makeCompany()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		inMemoryInterviewsRepository.create(interviewScheduled)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
			companyId: company.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
