import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { Interview } from '@/domain/interviewer/entities/interview'
import type { InterviewsRepository } from '@/domain/interviewer/repositories/interviews-repository'
import { PrismaInterviewMapper } from '@/infra/database/prisma/mappers/prisma-interview-mapper'
import type { Interview as PrismaInterview } from '@prisma/client'

export class InMemoryInterviewsRepository implements InterviewsRepository {
	public items: PrismaInterview[] = []

	async findAll({ page }: PaginationParams) {
		const interviews = this.items.slice((page - 1) * 10, page * 10)

		return interviews.map(PrismaInterviewMapper.toDomain)
	}

	async findById(interviewId: string) {
		const interview = this.items.find(
			(interview) => interview.id.toString() === interviewId,
		)

		if (!interview) {
			return null
		}

		return interview ? PrismaInterviewMapper.toDomain(interview) : null
	}

	async create(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		this.items.push(prismaInterview)
	}

	async finishInterview(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		const interviewInIndex = this.items.findIndex(
			(item) => item.id === prismaInterview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = prismaInterview
		}

		// return interview
	}

	async startInterview(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		const interviewInIndex = this.items.findIndex(
			(item) => item.id === prismaInterview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = prismaInterview
		}

		// return interview
	}

	async sendContract(interview: Interview) {
		const prismaInterview = PrismaInterviewMapper.toPrisma(interview)

		const interviewInIndex = this.items.findIndex(
			(item) => item.id === prismaInterview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = prismaInterview
		}

		// return interview
	}
}
