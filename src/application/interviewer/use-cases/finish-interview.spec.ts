import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import { makeClient } from '@/tests/factories/make-client'
import { makeCompany } from '@/tests/factories/make-company'
import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { FinishInterviewUseCase } from './finish-interview'

let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let sut: FinishInterviewUseCase

describe('Finish Interview', () => {
	beforeEach(() => {
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		inMemoryClientsRepository = new InMemoryClientsRepository()
		sut = new FinishInterviewUseCase(
			inMemoryClientsRepository,
			inMemoryInterviewsRepository,
		)
	})

	it('Should be able to finish interview', async () => {
		const company = makeCompany()
		const client = makeClient({
			companyId: company.id,
		})
		const interviewPending = makeInterview({
			status: STATUS_INTERVIEW.PENDING,
			clientId: client.id,
			companyId: company.id,
		})

		inMemoryClientsRepository.create(client)
		inMemoryInterviewsRepository.create(interviewPending)

		interviewPending.changeStatus(STATUS_INTERVIEW.PENDING)

		const result = await sut.execute({
			interviewId: interviewPending.id.toString(),
			clientId: client.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(STATUS_INTERVIEW.COMPLETED)
		}
	})

	it('Should be able throw an error if interview is not found', async () => {
		const client = makeClient()
		const interviewScheduled = makeInterview()

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
			clientId: client.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('Should be able throw an error if interview status is different from PENDING', async () => {
		const client = makeClient()
		const interviewScheduled = makeInterview({
			clientId: client.id,
		})

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		inMemoryInterviewsRepository.create(interviewScheduled)

		const result = await sut.execute({
			interviewId: interviewScheduled.id.toString(),
			clientId: client.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
