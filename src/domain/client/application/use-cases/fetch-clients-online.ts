import { type Either, success } from '@/core/either'
import type { Client } from '@/domain/client/enterprise/entities/client'
import type { ClientsRepository } from '@/domain/company/application/repositories/clients-repository'

interface FetchClientsOnlineUseCaseRequest {
	page: number
	clientIds: string[]
}

type FetchClientsOnlineUseCaseResponse = Either<
	null,
	{ clients: Client[] | null }
>

export class FetchClientsOnlineUseCase {
	constructor(private clientsRepository: ClientsRepository) {}

	async execute({
		page,
		clientIds,
	}: FetchClientsOnlineUseCaseRequest): Promise<FetchClientsOnlineUseCaseResponse> {
		const clients = await this.clientsRepository.findAllOnline(
			{ page },
			clientIds,
		)

		return success({ clients })
	}
}
