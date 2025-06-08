import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { AuthenticateCompanyUseCase } from './authenticate-company'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: AuthenticateCompanyUseCase

describe('Authenticate Company Use Case', () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

		sut = new AuthenticateCompanyUseCase(inMemoryCompaniesRepository)
	})

	it('Should be able to authenticate company', async () => {
		const password = faker.internet.password()
		const company = makeCompany({
			password: await hash(password, 10),
		})

		await inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			email: company.email,
			password: password,
		})

		expect(result.isSuccess()).toBe(true)
		expect(company.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const company = makeCompany({
			password: await hash(faker.internet.password(), 10),
		})

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: company.password,
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const company = makeCompany({
			password: await hash(faker.internet.password(), 10),
		})

		await inMemoryCompaniesRepository.create(company)

		company.changePassword(await hash(faker.internet.password(), 10))

		const result = await sut.execute({
			email: company.email,
			password: company.password,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
