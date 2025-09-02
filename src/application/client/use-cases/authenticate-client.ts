import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'

interface AuthenticateClientUseCaseRequest {
	document: string
}

type AuthenticateClientUseCaseResponse = Either<
	InvalidCredencialsError,
	{ client: Client }
>

export class AuthenticateClientUseCase {
	constructor(private readonly clientsRepository: ClientsRepository) {}

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
