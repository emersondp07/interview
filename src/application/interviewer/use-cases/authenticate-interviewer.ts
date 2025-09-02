import { type Either, failed, success } from '@/domain/core/either'
import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import type { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import { compare } from 'bcryptjs'

interface AuthenticateInterviewerUseCaseRequest {
	email: string
	password: string
}

type AuthenticateInterviewerUseCaseResponse = Either<
	InvalidCredencialsError,
	{ interviewer: Interviewer }
>

export class AuthenticateInterviewerUseCase {
	constructor(
		private readonly interviewersRepository: InterviewersRepository,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateInterviewerUseCaseRequest): Promise<AuthenticateInterviewerUseCaseResponse> {
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
