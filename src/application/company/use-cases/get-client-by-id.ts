import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { Client } from '../../../domain/client/entities/client'
import type { ClientsRepository } from '../../../domain/company/repositories/clients-repository'

interface GetClientUseCaseRequest {
	clientId: string
}

type GetClientUseCaseResponse = Either<
	ResourceNotFoundError,
	{ client: Client | null }
>

export class GetClientByIdUseCase {
	constructor(
		private readonly clientsRepository: ClientsRepository,
		private readonly companiesRepository: CompaniesRepository,
	) {}

	async execute({
		clientId,
	}: GetClientUseCaseRequest): Promise<GetClientUseCaseResponse> {
		const client = await this.clientsRepository.findById(clientId)

		if (!client) {
			return failed(new ResourceNotFoundError())
		}

		return success({ client })
	}
}
