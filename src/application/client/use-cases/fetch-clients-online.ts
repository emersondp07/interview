import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, success } from '@/domain/core/either'

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
