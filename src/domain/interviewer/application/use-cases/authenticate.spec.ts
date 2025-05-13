import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'

let interviewersRepository: InMemoryInterviewersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		interviewersRepository = new InMemoryInterviewersRepository()

		sut = new AuthenticateUseCase(interviewersRepository)
	})

	it('Should be able to authenticate', async () => {
		const interviewer = makeInterviewer({
			email: 'teste@email.com',
			password: await hash('123456', 10),
		})

		await interviewersRepository.create(interviewer)

		await sut.execute({
			email: interviewer.email,
			password: interviewer.password,
		})

		expect(interviewer.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const interviewer = makeInterviewer({
			email: 'johndoe@example.com',
			password: await hash('123456', 10),
		})

		await interviewersRepository.create(interviewer)

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '9874654',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
