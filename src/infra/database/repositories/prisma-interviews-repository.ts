import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewsRepository } from '@/domain/interviewer/application/repositories/interviews-repository'
import type { Interview } from '@/domain/interviewer/enterprise/entities/interview'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewsRepository implements InterviewsRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.interview.findMany({
			select: {
				id: true,
				status: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Interview[]
	}

	async findById(interviewId: string) {
		return prisma.interview.findUnique({
			where: {
				id: interviewId,
			},
			select: {
				id: true,
				status: true,
			},
		}) as unknown as Interview
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
		return prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		}) as unknown as Interview
	}

	async startInterview(interview: Interview) {
		return prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		}) as unknown as Interview
	}

	async sendContract(interview: Interview) {
		return prisma.interview.update({
			where: {
				id: interview.id.toString(),
			},
			data: {
				status: interview.status,
			},
		}) as unknown as Interview
	}
}
