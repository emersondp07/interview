import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewersRepository } from '@/domain/interviewer/application/repositories/interviewers-repository'
import type { Interviewer } from '@/domain/interviewer/enterprise/entities/interviewer'

export class InMemoryInterviewersRepository implements InterviewersRepository {
	public items: Interviewer[] = []

	async findAll({ page }: PaginationParams) {
		const interviewers = this.items.slice((page - 1) * 10, page * 10)

		return interviewers
	}

	async findById(interviewerId: string) {
		const interviewer = this.items.find(
			(interviewer) => interviewer.id.toString() === interviewerId,
		)

		if (!interviewer) {
			return null
		}

		return interviewer
	}

	async findByEmail(email: string) {
		const interviewer = this.items.find(
			(interviewer) => interviewer.email === email,
		)

		if (!interviewer) {
			return null
		}

		return interviewer
	}

	async create(interviewer: Interviewer) {
		this.items.push(interviewer)
	}

	async delete(interviewerId: string): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === interviewerId,
		)

		this.items.splice(itemIndex, 1)
	}
}
