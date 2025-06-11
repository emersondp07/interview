import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Client } from '@/domain/client/enterprise/entities/client'
import type { ClientsRepository } from '@/domain/company/application/repositories/clients-repository'

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
