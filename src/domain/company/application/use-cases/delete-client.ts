import { type Either, failed, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import type { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { ClientsRepository } from '../repositories/clients-repository'

interface DeleteClientUseCaseRequest {
	clientId: string
}

type DeleteClientUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteClientUseCase {
	constructor(private clientsRepository: ClientsRepository) {}

	async execute({
		clientId,
	}: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
		const client = await this.clientsRepository.findById(clientId)

		if (!client) {
			return failed(new NotAllowedError())
		}

		await this.clientsRepository.delete(client)

		return success({})
	}
}
