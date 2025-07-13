import { makeAdministrator } from '@/tests/factories/make-administrator'
import { InMemoryAdministratorsRepository } from '@/tests/repositories/in-memory-administrators-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { InvalidCredencialsError } from '../../../domain/core/errors/errors/invalid-credencials-error'
import { AuthenticateAdministratorUseCase } from './authenticate-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: AuthenticateAdministratorUseCase

describe('Authenticate Administrator Use Case', () => {
	beforeEach(() => {
		inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

		sut = new AuthenticateAdministratorUseCase(inMemoryAdministratorsRepository)
	})

	it('Should be able to authenticate interviewer', async () => {
		const password = faker.internet.password()
		const administrator = makeAdministrator({
			password: await hash(password, 10),
		})

		await inMemoryAdministratorsRepository.create(administrator)

		const result = await sut.execute({
			email: administrator.email,
			password: password,
		})

		expect(result.isSuccess()).toBe(true)
		expect(administrator.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const administrator = makeAdministrator({
			password: await hash(faker.internet.password(), 10),
		})

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: administrator.password,
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const administrator = makeAdministrator({
			password: await hash(faker.internet.password(), 10),
		})

		await inMemoryAdministratorsRepository.create(administrator)

		administrator.changeEmail(await hash(faker.internet.password(), 10))

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: administrator.password,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
