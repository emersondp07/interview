import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { prisma } from '../prisma/prisma'

export class PrismaTriagesRepository {
	async findAll({ page }: PaginationParams) {
		const triages = await prisma.triage.findMany({
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return triages
	}

	async findById(triageId: string) {
		const triage = await prisma.triage.findUnique({
			where: {
				id: triageId,
			},
		})

		return triage
	}

	async findByClientId(clientId: string, { page }: PaginationParams) {
		const triages = await prisma.triage.findMany({
			where: {
				client_id: clientId,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return triages
	}

	async findByAppointmentId(appointmentId: string) {
		const triage = await prisma.triage.findFirst({
			where: {
				appointment: {
					some: {
						id: appointmentId,
					},
				},
			},
		})

		return triage
	}

	async create(data: any) {
		await prisma.triage.create({
			data,
		})
	}

	async update(triageId: string, data: any) {
		await prisma.triage.update({
			where: {
				id: triageId,
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(triageId: string) {
		await prisma.triage.update({
			where: {
				id: triageId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
