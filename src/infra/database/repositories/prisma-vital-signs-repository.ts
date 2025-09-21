import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { prisma } from '../prisma/prisma'

export class PrismaVitalSignsRepository {
	async findAll({ page }: PaginationParams) {
		const vitalSigns = await prisma.vitalSigns.findMany({
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				measured_at: 'desc',
			},
		})

		return vitalSigns
	}

	async findById(vitalSignsId: string) {
		const vitalSigns = await prisma.vitalSigns.findUnique({
			where: {
				id: vitalSignsId,
			},
		})

		return vitalSigns
	}

	async findByClientId(clientId: string, { page }: PaginationParams) {
		const vitalSigns = await prisma.vitalSigns.findMany({
			where: {
				client_id: clientId,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				measured_at: 'desc',
			},
		})

		return vitalSigns
	}

	async findByInterviewId(interviewId: string) {
		const vitalSigns = await prisma.vitalSigns.findMany({
			where: {
				interview_id: interviewId,
			},
			orderBy: {
				measured_at: 'desc',
			},
		})

		return vitalSigns
	}

	async findLatestByClientId(clientId: string) {
		const vitalSigns = await prisma.vitalSigns.findFirst({
			where: {
				client_id: clientId,
			},
			orderBy: {
				measured_at: 'desc',
			},
		})

		return vitalSigns
	}

	async create(data: any) {
		await prisma.vitalSigns.create({
			data,
		})
	}

	async update(vitalSignsId: string, data: any) {
		await prisma.vitalSigns.update({
			where: {
				id: vitalSignsId,
			},
			data,
		})
	}

	async delete(vitalSignsId: string) {
		await prisma.vitalSigns.update({
			where: {
				id: vitalSignsId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
