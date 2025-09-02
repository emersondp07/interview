import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, success } from '@/domain/core/either'

interface FetchClientsUseCaseRequest {
	companyId: string
	page: number
}

type FetchClientsUseCaseResponse = Either<null, { clients: Client[] | null }>

export class FetchClientsUseCase {
	constructor(private readonly clientsRepository: ClientsRepository) {}

	async execute({
		companyId,
		page,
	}: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
		const clients = await this.clientsRepository.findAll(companyId, { page })

		return success({ clients })
	}
}
