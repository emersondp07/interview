import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import { PrismaInterviewerMapper } from '@/infra/database/prisma/mappers/prisma-interviewer-mapper'
import type { Interviewer as PrismaInterviewer } from '@prisma/client'
import type { Interviewer } from '../../domain/interviewer/entities/interviewer'

export class InMemoryInterviewersRepository implements InterviewersRepository {
	public items: PrismaInterviewer[] = []

	async findAll(companyId: string, { page }: PaginationParams) {
		const interviewers = this.items.filter(
			(interviewer) => interviewer.company_id === companyId,
		)
		const interviewersInPage = interviewers.slice((page - 1) * 10, page * 10)

		return interviewersInPage.map(PrismaInterviewerMapper.toDomain)
	}

	async findById(companyId: string, interviewerId: string) {
		const interviewer = this.items.find(
			(interviewer) =>
				interviewer.id === interviewerId &&
				interviewer.company_id === companyId,
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

	async delete(interviewer: Interviewer) {
		const prismaInterviewer = PrismaInterviewerMapper.toPrisma(interviewer)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaInterviewer.id,
		)

		this.items[itemIndex] = { ...prismaInterviewer, deleted_at: new Date() }
	}
}
