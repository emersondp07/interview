import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { prisma } from '../prisma/prisma'

export class PrismaPrescriptionsRepository {
	async findAll({ page }: PaginationParams) {
		const prescriptions = await prisma.prescription.findMany({
			where: {
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return prescriptions
	}

	async findById(prescriptionId: string) {
		const prescription = await prisma.prescription.findUnique({
			where: {
				id: prescriptionId,
			},
			include: {
				medications: true,
			},
		})

		return prescription
	}

	async findByClientId(clientId: string, { page }: PaginationParams) {
		const prescriptions = await prisma.prescription.findMany({
			where: {
				client_id: clientId,
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
			include: {
				medications: true,
			},
		})

		return prescriptions
	}

	async findByInterviewerId(interviewerId: string, { page }: PaginationParams) {
		const prescriptions = await prisma.prescription.findMany({
			where: {
				interviewer_id: interviewerId,
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
			include: {
				medications: true,
			},
		})

		return prescriptions
	}

	async findByInterviewId(interviewId: string) {
		const prescriptions = await prisma.prescription.findMany({
			where: {
				interview_id: interviewId,
				deleted_at: null,
			},
			orderBy: {
				created_at: 'desc',
			},
			include: {
				medications: true,
			},
		})

		return prescriptions
	}

	async create(data: any) {
		await prisma.prescription.create({
			data,
		})
	}

	async update(prescriptionId: string, data: any) {
		await prisma.prescription.update({
			where: {
				id: prescriptionId,
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(prescriptionId: string) {
		await prisma.prescription.update({
			where: {
				id: prescriptionId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
