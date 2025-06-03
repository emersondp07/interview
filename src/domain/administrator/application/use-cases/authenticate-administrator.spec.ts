import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { makeAdministrator } from '@/tests/factories/make-administrator'
import { InMemoryAdministratorsRepository } from '@/tests/repositories/in-memory-administrators-repository'
import { hash } from 'bcryptjs'
import { AuthenticateAdministratorUseCase } from './authenticate-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: AuthenticateAdministratorUseCase

describe('Authenticate Administrator Use Case', () => {
	beforeEach(() => {
		inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

		sut = new AuthenticateAdministratorUseCase(inMemoryAdministratorsRepository)
	})

	it('Should be able to authenticate interviewer', async () => {
		const administrator = makeAdministrator({
			email: 'teste@email.com',
			password: await hash('123456', 10),
		})

		await inMemoryAdministratorsRepository.create(administrator)

		const result = await sut.execute({
			email: administrator.email,
			password: '123456',
		})

		expect(result.isSuccess()).toBe(true)
		expect(administrator.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const administrator = makeAdministrator({
			email: 'johndoe@example.com',
			password: await hash('123456', 10),
		})

		await inMemoryAdministratorsRepository.create(administrator)

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '9874654',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
