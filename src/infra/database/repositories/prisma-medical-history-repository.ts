import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { prisma } from '../prisma/prisma'

export class PrismaMedicalHistoryRepository {
	async findAll({ page }: PaginationParams) {
		const medicalHistory = await prisma.medicalHistory.findMany({
			where: {
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				date: 'desc',
			},
		})

		return medicalHistory
	}

	async findById(historyId: string) {
		const medicalHistory = await prisma.medicalHistory.findUnique({
			where: {
				id: historyId,
			},
		})

		return medicalHistory
	}

	async findByClientId(clientId: string, { page }: PaginationParams) {
		const medicalHistory = await prisma.medicalHistory.findMany({
			where: {
				client_id: clientId,
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				date: 'desc',
			},
		})

		return medicalHistory
	}

	async findByInterviewId(interviewId: string) {
		const medicalHistory = await prisma.medicalHistory.findMany({
			where: {
				interview_id: interviewId,
				deleted_at: null,
			},
			orderBy: {
				date: 'desc',
			},
		})

		return medicalHistory
	}

	async findByType(clientId: string, type: string) {
		const medicalHistory = await prisma.medicalHistory.findMany({
			where: {
				client_id: clientId,
				type: type as any,
				deleted_at: null,
			},
			orderBy: {
				date: 'desc',
			},
		})

		return medicalHistory
	}

	async create(data: any) {
		await prisma.medicalHistory.create({
			data,
		})
	}

	async update(historyId: string, data: any) {
		await prisma.medicalHistory.update({
			where: {
				id: historyId,
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(historyId: string) {
		await prisma.medicalHistory.update({
			where: {
				id: historyId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
