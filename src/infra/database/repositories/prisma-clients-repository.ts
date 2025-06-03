import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Client } from '@/domain/client/enterprise/entities/client'
import type { ClientsRepository } from '@/domain/company/application/repositories/clients-repository'
import { PrismaClientMapper } from '../prisma/mappers/prisma-client-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaClientsRepository implements ClientsRepository {
	async findAll({ page }: PaginationParams) {
		const clients = await prisma.client.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return clients.map(PrismaClientMapper.toDomain)
	}

	async findById(clientId: string) {
		const client = await prisma.client.findUnique({
			where: {
				id: clientId,
			},
		})

		return client ? PrismaClientMapper.toDomain(client) : null
	}

	async findByDocument(document: string) {
		const client = await prisma.client.findUnique({
			where: {
				document,
			},
		})

		return client ? PrismaClientMapper.toDomain(client) : null
	}

	async create(client: Client): Promise<void> {
		await prisma.client.create({
			data: {
				id: client.id.toString(),
				name: client.name,
				email: client.email,
				phone: client.phone,
				birth_date: client.birthDate,
				document_type: client.documentType,
				document: client.document,
				role: client.role,
				company_id: client.companyId.toString(),
			},
		})
	}

	async delete(client: Client): Promise<void> {
		await prisma.client.update({
			where: {
				id: client.id.toString(),
			},
			data: {
				deleted_at: new Date(),
			},
		})
	}
}
