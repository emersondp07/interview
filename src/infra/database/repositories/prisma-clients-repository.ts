import type { Client } from '@/domain/client/entities/client'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
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

	async findAllOnline({ page }: PaginationParams, clients: string[]) {
		const clientsOnline = await prisma.client.findMany({
			where: {
				id: {
					in: clients,
				},
			},
			include: {
				interviews: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		})

		return clientsOnline.map(PrismaClientMapper.toDomain)
	}

	async findById(companyId: string, clientId: string) {
		const client = await prisma.client.findUnique({
			where: {
				id: clientId,
				company_id: companyId,
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

	async create(client: Client) {
		const prismaClient = PrismaClientMapper.toPrisma(client)

		await prisma.client.create({
			data: prismaClient,
		})
	}

	async delete(client: Client) {
		const prismaClient = PrismaClientMapper.toPrisma(client)

		await prisma.client.update({
			where: {
				id: prismaClient.id,
			},
			data: {
				deleted_at: new Date(),
			},
		})
	}
}
