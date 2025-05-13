import { type Either, failed, success } from '@/core/either'
import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { compare } from 'bcryptjs'
import type { Interviewer } from '../../enterprise/entities/interviewer'
import type { InterviewersRepository } from '../repositories/interviewers-repository'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

type AuthenticateUseCaseResponse = Either<
	InvalidCredencialsError,
	{ interviewer: Interviewer | null }
>

export class AuthenticateUseCase {
	constructor(private interviewersRepository: InterviewersRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const interviewer = await this.interviewersRepository.findByEmail(email)

		if (!interviewer) {
			return failed(new InvalidCredencialsError())
		}

		const doesPasswordMatches = await compare(password, interviewer.password)

		if (!doesPasswordMatches) {
			return failed(new InvalidCredencialsError())
		}

		return success({ interviewer })
	}
}
