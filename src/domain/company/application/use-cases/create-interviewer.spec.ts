import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, it } from 'vitest'
import { CreateInterviewerUseCase } from './create-interviewer'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: CreateInterviewerUseCase

describe('Create Interviewer', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		sut = new CreateInterviewerUseCase(
			inMemoryInterviewersRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to create an interviewer', async () => {
		const company = makeCompany()

		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			companyId: company.id.toString(),
		})

		expect(inMemoryInterviewersRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
		expect(inMemoryInterviewersRepository.items[0].company_id).toEqual(
			company.id.toString(),
		)
	})

	it('Should not be able to create an interviewer if company is not exist', async () => {
		const company = makeCompany()

		const result = await sut.execute({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			companyId: company.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
