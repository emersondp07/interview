import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewersRepository } from '@/domain/interviewer/application/repositories/interviewers-repository'
import type { Interviewer as PrismaInterviewer } from '@prisma/client'
import type { Interviewer } from '../../domain/interviewer/enterprise/entities/interviewer'
import { PrismaInterviewerMapper } from '../../infra/database/prisma/mappers/prisma-interviewer-mapper'

export class InMemoryInterviewersRepository implements InterviewersRepository {
	public items: PrismaInterviewer[] = []

	async findAll({ page }: PaginationParams) {
		const interviewers = this.items.slice((page - 1) * 10, page * 10)

		return interviewers.map(PrismaInterviewerMapper.toDomain)
	}

	async findById(interviewerId: string) {
		const interviewer = this.items.find(
			(interviewer) => interviewer.id.toString() === interviewerId,
		)

		if (!interviewer) {
			return null
		}

		return interviewer ? PrismaInterviewerMapper.toDomain(interviewer) : null
	}

	async findByEmail(email: string) {
		const interviewer = this.items.find(
			(interviewer) => interviewer.email === email,
		)

		if (!interviewer) {
			return null
		}

		return interviewer ? PrismaInterviewerMapper.toDomain(interviewer) : null
	}

	async create(interviewer: Interviewer) {
		const prismaInterviewer = PrismaInterviewerMapper.toPrisma(interviewer)

		this.items.push(prismaInterviewer)
	}

	async delete(interviewerId: string): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === interviewerId,
		)

		this.items.splice(itemIndex, 1)
	}
}
