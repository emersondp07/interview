import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import type { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface DeleteClientUseCaseRequest {
	companyId: string
	clientId: string
}

type DeleteClientUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteClientUseCase {
	constructor(private readonly clientsRepository: ClientsRepository) {}

	async execute({
		companyId,
		clientId,
	}: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
		const client = await this.clientsRepository.findByIdAndCompanyId(
			companyId,
			clientId,
		)

		if (!client) {
			return failed(new NotAllowedError())
		}

		await this.clientsRepository.delete(client)

		return success({})
	}
}
