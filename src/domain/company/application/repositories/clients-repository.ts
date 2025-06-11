import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Client } from '../../../client/enterprise/entities/client'

export interface ClientsRepository {
	findAll(params: PaginationParams): Promise<Client[] | null>
	findAllOnline(
		params: PaginationParams,
		clients: string[],
	): Promise<Client[] | null>
	findById(clientId: string): Promise<Client | null>
	findByDocument(document: string): Promise<Client | null>
	create(client: Client): Promise<void>
	delete(client: Client): Promise<void>
}
