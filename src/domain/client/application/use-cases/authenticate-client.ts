import { type Either, failed, success } from '@/core/either'
import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import type { ClientsRepository } from '../../../company/application/repositories/clients-repository'
import type { Client } from '../../enterprise/entities/client'

interface AuthenticateClientUseCaseRequest {
	document: string
}

type AuthenticateClientUseCaseResponse = Either<
	InvalidCredencialsError,
	{ client: Client }
>

export class AuthenticateClientUseCase {
	constructor(private clientsRepository: ClientsRepository) {}

	async execute({
		document,
	}: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
		const client = await this.clientsRepository.findByDocument(document)

		if (!client) {
			return failed(new InvalidCredencialsError())
		}

		return success({ client })
	}
}
