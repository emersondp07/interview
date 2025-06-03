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
		await prisma.interview.create({
			data: {
				status: interview.status,
				client_id: interview.clientId.toString(),
			},
		})
	}

	async finishInterview(interview: Interview) {
		await prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		})
	}

	async startInterview(interview: Interview) {
		await prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		})
	}

	async sendContract(interview: Interview) {
		await prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		})
	}
}
