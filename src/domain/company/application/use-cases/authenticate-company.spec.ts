import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
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
		const company = makeCompany({
			email: 'teste@email.com',
			password: await hash('123456', 10),
		})

		await inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			email: company.email,
			password: '123456',
		})

		expect(result.isSuccess()).toBe(true)
		expect(company.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const company = makeCompany({
			email: 'johndoe@example.com',
			password: await hash('123456', 10),
		})

		await inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '9874654',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
