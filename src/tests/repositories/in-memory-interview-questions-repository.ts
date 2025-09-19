import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

export class InMemoryInterviewQuestionsRepository
	implements InterviewQuestionsRepository
{
	public items: InterviewQuestion[] = []

	async create(interviewQuestion: InterviewQuestion): Promise<void> {
		this.items.push(interviewQuestion)
	}

	async findById(id: string): Promise<InterviewQuestion | null> {
		const interviewQuestion = this.items.find(
			(item) => item.id.toString() === id && !item.deletedAt,
		)
		return interviewQuestion || null
	}

	async findAll({ page }: PaginationParams): Promise<InterviewQuestion[]> {
		return this.items
			.filter((item) => !item.deletedAt)
			.slice((page - 1) * 10, page * 10)
	}

	async findByInterviewId(
		interviewId: string,
	): Promise<InterviewQuestion[] | null> {
		return this.items.filter(
			(item) => item.interviewId?.toString() === interviewId && !item.deletedAt,
		)
	}

	async update(
		questionId: string,
		interviewQuestion: InterviewQuestion,
	): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === questionId,
		)

		if (itemIndex >= 0) {
			this.items[itemIndex] = interviewQuestion
		}
	}

	async delete(questionId: string): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === questionId,
		)

		if (itemIndex >= 0) {
			this.items[itemIndex].delete()
		}
	}
}
