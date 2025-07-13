import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import { PrismaInterviewerMapper } from '../prisma/mappers/prisma-interviewer-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewersRepository implements InterviewersRepository {
	async findAll({ page }: PaginationParams) {
		const interviewers = await prisma.interviewer.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return interviewers.map(PrismaInterviewerMapper.toDomain)
	}

	async findById(interviewerId: string) {
		const interviewer = await prisma.interviewer.findUnique({
			where: {
				id: interviewerId,
			},
		})

		return interviewer ? PrismaInterviewerMapper.toDomain(interviewer) : null
	}

	async findByEmail(email: string) {
		const interviewer = await prisma.interviewer.findUnique({
			where: {
				email,
			},
		})

		return interviewer ? PrismaInterviewerMapper.toDomain(interviewer) : null
	}

	async create(interviewer: Interviewer) {
		const prismaInterviewer = PrismaInterviewerMapper.toPrisma(interviewer)

		await prisma.interviewer.create({
			data: prismaInterviewer,
		})
	}

	async delete(interviewerId: string) {
		await prisma.interviewer.update({
			where: {
				id: interviewerId,
			},
			data: {
				deleted_at: new Date(),
			},
		})
	}
}
