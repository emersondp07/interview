import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Client } from '@/domain/client/enterprise/entities/client'
import type { ClientsRepository } from '@/domain/company/application/repositories/clients-repository'
import { prisma } from '../prisma/prisma'

export class PrismaClientsRepository implements ClientsRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.client.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Client[]
	}

	async findById(clientId: string) {
		return prisma.client.findUnique({
			where: {
				id: clientId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
		}) as unknown as Client
	}

	async findByDocument(document: string) {
		return prisma.client.findUnique({
			where: {
				document,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
		}) as unknown as Client
	}

	async create(client: Client): Promise<void> {
		await prisma.client.create({
			data: {
				id: client.id.toString(),
				name: client.name,
				email: client.email,
				phone: client.phone,
				birthDate: client.birthDate,
				documentType: client.documentType,
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
