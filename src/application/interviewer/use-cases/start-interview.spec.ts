import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import { makeClient } from '@/tests/factories/make-client'
import { makeInterview } from '@/tests/factories/make-interview'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { makeInterviewer } from '../../../tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '../../../tests/repositories/in-memory-interviewers-repository'
import { StartInterviewUseCase } from './start-interview'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let sut: StartInterviewUseCase

describe('Start Interview', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		sut = new StartInterviewUseCase(
			inMemoryClientsRepository,
			inMemoryInterviewsRepository,
			inMemoryInterviewersRepository,
		)
	})

	it('Should be able to start interview', async () => {
		const client = makeClient()

		const interviewer = makeInterviewer()

		const interviewScheduled = makeInterview()

		inMemoryClientsRepository.create(client)

		inMemoryInterviewersRepository.create(interviewer)

		inMemoryInterviewsRepository.create(interviewScheduled)

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		const result = await sut.execute({
			clientId: client.id.toString(),
			interviewId: interviewScheduled.id.toString(),
			interviewerId: interviewer.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.interview.status).toEqual(
				STATUS_INTERVIEW.IN_PROGRESS,
			)
		}
	})

	it('Should be able throw an error if interview is not found', async () => {
		const client = makeClient()
		const interviewer = makeInterviewer()
		const interviewScheduled = makeInterview()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.SCHEDULED)

		inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: client.id.toString(),
			interviewId: interviewScheduled.id.toString(),
			interviewerId: interviewer.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('Should be able throw an error if interview status is different from SCHEDULED', async () => {
		const client = makeClient()
		const interviewer = makeInterviewer()

		const interviewScheduled = makeInterview()

		interviewScheduled.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		inMemoryInterviewsRepository.create(interviewScheduled)

		inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: client.id.toString(),
			interviewId: interviewScheduled.id.toString(),
			interviewerId: interviewer.id.toString(),
		})

		if (result.isFailed()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
