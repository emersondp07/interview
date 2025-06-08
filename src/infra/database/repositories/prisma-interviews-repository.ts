import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewsRepository } from '@/domain/interviewer/application/repositories/interviews-repository'
import type { Interview } from '@/domain/interviewer/enterprise/entities/interview'
import { PrismaInterviewMapper } from '../prisma/mappers/prisma-interview-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewsRepository implements InterviewsRepository {
	async findAll({ page }: PaginationParams) {
		const interviews = await prisma.interview.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return interviews.map(PrismaInterviewMapper.toDomain)
	}

	async findById(interviewId: string) {
		const interview = await prisma.interview.findUnique({
			where: {
				id: interviewId,
			},
		})

		return interview ? PrismaInterviewMapper.toDomain(interview) : null
	}

	async create(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		await prisma.interview.create({
			data: prismaInterview,
		})
	}

	async finishInterview(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		await prisma.interview.update({
			where: {
				id: prismaInterview.id,
			},
			data: {
				status: prismaInterview.status,
			},
		})
	}

	async startInterview(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		await prisma.interview.update({
			where: {
				id: prismaInterview.id,
			},
			data: {
				status: prismaInterview.status,
			},
		})
	}

	async sendContract(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		await prisma.interview.update({
			where: {
				id: prismaInterview.id,
			},
			data: {
				status: prismaInterview.status,
			},
		})
	}
}
