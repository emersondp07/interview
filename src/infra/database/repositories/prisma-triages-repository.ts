import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'
import { PrismaTriageMapper } from '../prisma/mappers/prisma-triage-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaTriagesRepository implements TriagesRepository {
	async findAll({ page }: PaginationParams): Promise<Triage[] | null> {
		const triages = await prisma.triage.findMany({
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return triages.map(PrismaTriageMapper.toDomain)
	}

	async findById(triageId: string): Promise<Triage | null> {
		const triage = await prisma.triage.findUnique({
			where: {
				id: triageId,
			},
		})

		if (!triage) {
			return null
		}

		return PrismaTriageMapper.toDomain(triage)
	}

	async findByClientId(clientId: string, { page }: PaginationParams): Promise<Triage[] | null> {
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

		return triages.map(PrismaTriageMapper.toDomain)
	}

	async findByAppointmentId(appointmentId: string): Promise<Triage | null> {
		const triage = await prisma.triage.findFirst({
			where: {
				appointment: {
					some: {
						id: appointmentId,
					},
				},
			},
		})

		if (!triage) {
			return null
		}

		return PrismaTriageMapper.toDomain(triage)
	}

	async create(triage: Triage): Promise<void> {
		const data = PrismaTriageMapper.toPrisma(triage)
		await prisma.triage.create({
			data,
		})
	}

	async update(triage: Triage): Promise<void> {
		const data = PrismaTriageMapper.toPrisma(triage)
		await prisma.triage.update({
			where: {
				id: triage.id.toString(),
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(triage: Triage): Promise<void> {
		await prisma.triage.update({
			where: {
				id: triage.id.toString(),
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
