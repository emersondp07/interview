import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface GetClientByDocumentUseCaseRequest {
	document: string
}

type GetClientByDocumentUseCaseResponse = Either<
	ResourceNotFoundError,
	{ client: Client }
>

export class GetClientByDocumentUseCase {
	constructor(private clientsRepository: ClientsRepository) {}

	async execute({
		document,
	}: GetClientByDocumentUseCaseRequest): Promise<GetClientByDocumentUseCaseResponse> {
		const client = await this.clientsRepository.findByDocument(document)

		if (!client) {
			return failed(new ResourceNotFoundError())
		}

		return success({ client })
	}
}
