import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { GetInterviewerByIdUseCase } from './get-interviewer-by-id'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: GetInterviewerByIdUseCase

describe('Get Interviewer By Id', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

		sut = new GetInterviewerByIdUseCase(
			inMemoryInterviewersRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to get an interviewer by id with COMPANY role', async () => {
		const interviewer = makeInterviewer()

		await inMemoryInterviewersRepository.create(interviewer)

		const result = await sut.execute({
			userId: 'any-user-id',
			interviewerId: interviewer.id.toString(),
			role: ROLE.COMPANY,
		})

		expect(result.isSuccess()).toBe(true)

		if (result.isSuccess()) {
			expect(result.value.interviewer?.id).toEqual(interviewer.id)
			expect(result.value.interviewer?.name).toEqual(interviewer.name)
			expect(result.value.interviewer?.email).toEqual(interviewer.email)
			expect(result.value.interviewer?.specialty).toEqual(interviewer.specialty)
		}
	})

	it('Should not be able to get an interviewer with invalid id', async () => {
		const result = await sut.execute({
			userId: 'any-user-id',
			interviewerId: 'invalid-interviewer-id',
			role: ROLE.COMPANY,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
