import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
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

	it('Should not be able to get an interviewer with non-COMPANY role and no company found', async () => {
		const interviewer = makeInterviewer()

		await inMemoryInterviewersRepository.create(interviewer)

		const result = await sut.execute({
			userId: 'invalid-user-id',
			interviewerId: interviewer.id.toString(),
			role: ROLE.INTERVIEWER,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should not be able to get an interviewer with non-COMPANY role and company mismatch', async () => {
		const company1 = makeCompany()
		const company2 = makeCompany()
		const interviewer = makeInterviewer({
			companyId: company2.id,
		})

		await inMemoryCompaniesRepository.create(company1)
		await inMemoryCompaniesRepository.create(company2)
		await inMemoryInterviewersRepository.create(interviewer)

		const result = await sut.execute({
			userId: company1.id.toString(),
			interviewerId: interviewer.id.toString(),
			role: ROLE.INTERVIEWER,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
