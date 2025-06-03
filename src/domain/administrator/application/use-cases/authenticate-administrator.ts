import { type Either, failed, success } from '@/core/either'
import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { compare } from 'bcryptjs'
import type { Administrator } from '../../enterprise/entities/administrator'
import type { AdministratorsRepository } from '../repositories/administrators-repository'

interface AuthenticateAdministratorUseCaseRequest {
	email: string
	password: string
}

type AuthenticateAdministratorUseCaseResponse = Either<
	InvalidCredencialsError,
	{ administrator: Administrator }
>

export class AuthenticateAdministratorUseCase {
	constructor(private administratorsRepository: AdministratorsRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateAdministratorUseCaseRequest): Promise<AuthenticateAdministratorUseCaseResponse> {
		const administrator = await this.administratorsRepository.findByEmail(email)

		if (!administrator) {
			return failed(new InvalidCredencialsError())
		}

		const doesPasswordMatches = await compare(password, administrator.password)

		if (!doesPasswordMatches) {
			return failed(new InvalidCredencialsError())
		}

		return success({ administrator })
	}
}
