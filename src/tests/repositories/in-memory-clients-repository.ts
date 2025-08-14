import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'
import type { Client as PrismaClient } from '@prisma/client'

export class InMemoryClientsRepository implements ClientsRepository {
	public items: PrismaClient[] = []

	async findAll(companyId: string, { page }: PaginationParams) {
		const filterClients = this.items.filter(
			(client) => client.company_id === companyId,
		)
		const clients = filterClients.slice((page - 1) * 10, page * 10)

		return clients.map(PrismaClientMapper.toDomain)
	}

	async findAllOnline(
		{ page }: PaginationParams,
		clients: string[],
	): Promise<Client[] | null> {
		const filteredClients = this.items.filter((client) =>
			clients.includes(client.id),
		)

		const paginatedClients = filteredClients.slice((page - 1) * 10, page * 10)

		return paginatedClients.map(PrismaClientMapper.toDomain)
	}

	async findById(clientId: string) {
		const client = this.items.find((client) => client.id === clientId)

		if (!client) {
			return null
		}

		return client ? PrismaClientMapper.toDomain(client) : null
	}

	async findByIdAndCompanyId(companyId: string, clientId: string) {
		const client = this.items.find(
			(client) => client.id === clientId && client.company_id === companyId,
		)

		if (!client) {
			return null
		}

		return client ? PrismaClientMapper.toDomain(client) : null
	}

	async findByDocument(document: string) {
		const client = this.items.find((client) => client.document === document)

		if (!client) {
			return null
		}

		return client ? PrismaClientMapper.toDomain(client) : null
	}

	async create(client: Client) {
		const prismaClient = PrismaClientMapper.toPrisma(client)

		this.items.push(prismaClient)
	}

	async delete(client: Client) {
		const prismaClient = PrismaClientMapper.toPrisma(client)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaClient.id,
		)

		this.items[itemIndex] = { ...prismaClient, deleted_at: new Date() }
	}
}
