import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { AuthenticateInterviewerUseCase } from './authenticate-interviewer'

let interviewersRepository: InMemoryInterviewersRepository
let sut: AuthenticateInterviewerUseCase

describe('Authenticate Interviewer Use Case', () => {
	beforeEach(() => {
		interviewersRepository = new InMemoryInterviewersRepository()

		sut = new AuthenticateInterviewerUseCase(interviewersRepository)
	})

	it('Should be able to authenticate interviewer', async () => {
		const password = faker.internet.password()

		const interviewer = makeInterviewer({
			email: 'teste@email.com',
			password: await hash(password, 10),
		})

		await interviewersRepository.create(interviewer)

		const result = await sut.execute({
			email: interviewer.email,
			password: password,
		})

		expect(result.isSuccess()).toBe(true)
		expect(interviewer.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const interviewer = makeInterviewer({
			password: await hash(faker.internet.password(), 10),
		})

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: interviewer.password,
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const interviewer = makeInterviewer({
			password: await hash(faker.internet.password(), 10),
		})

		await interviewersRepository.create(interviewer)

		interviewer.changePassword(await hash(faker.internet.password(), 10))

		const result = await sut.execute({
			email: interviewer.email,
			password: interviewer.password,
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
