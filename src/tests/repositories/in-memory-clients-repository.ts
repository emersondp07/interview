import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Client } from '@/domain/client/enterprise/entities/client'
import type { ClientsRepository } from '@/domain/company/application/repositories/clients-repository'

export class InMemoryClientsRepository implements ClientsRepository {
	public items: Client[] = []

	async findAll({ page }: PaginationParams) {
		const clients = this.items.slice((page - 1) * 10, page * 10)

		return clients
	}

	async findById(clientId: string) {
		const client = this.items.find(
			(client) => client.id.toString() === clientId,
		)

		if (!client) {
			return null
		}

		return client
	}

	async findByDocument(document: string) {
		const client = this.items.find((client) => client.document === document)

		if (!client) {
			return null
		}

		return client
	}

	async create(client: Client) {
		this.items.push(client)
	}

	async delete(client: Client) {
		const itemIndex = this.items.findIndex((item) => item.id === client.id)

		this.items.splice(itemIndex, 1)
	}
}
