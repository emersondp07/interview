import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewsRepository } from '@/domain/interviewer/application/repositories/interviews-repository'
import type { Interview } from '@/domain/interviewer/enterprise/entities/interview'

export class InMemoryInterviewsRepository implements InterviewsRepository {
	public items: Interview[] = []

	async findAll({ page }: PaginationParams) {
		const interviews = this.items.slice((page - 1) * 10, page * 10)

		return interviews
	}

	async findById(interviewId: string) {
		const interview = this.items.find(
			(interview) => interview.id.toString() === interviewId,
		)

		if (!interview) {
			return null
		}

		return interview
	}

	async create(interview: Interview) {
		this.items.push(interview)
	}

	async finishInterview(interview: Interview) {
		const interviewInIndex = this.items.findIndex(
			(item) => item.id === interview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = interview
		}

		return interview
	}

	async startInterview(interview: Interview) {
		const interviewInIndex = this.items.findIndex(
			(item) => item.id === interview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = interview
		}

		return interview
	}

	async sendContract(interview: Interview) {
		const interviewInIndex = this.items.findIndex(
			(item) => item.id === interview.id,
		)

		if (interviewInIndex >= 0) {
			this.items[interviewInIndex] = interview
		}

		return interview
	}
}
