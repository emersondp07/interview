import type { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

export class InMemoryInterviewAnswersRepository
	implements InterviewAnswersRepository
{
	public items: InterviewAnswer[] = []

	async create(interviewAnswer: InterviewAnswer): Promise<void> {
		this.items.push(interviewAnswer)
	}

	async findById(id: string): Promise<InterviewAnswer | null> {
		const interviewAnswer = this.items.find(
			(item) => item.id.toString() === id && !item.deletedAt,
		)
		return interviewAnswer || null
	}

	async findAll(): Promise<InterviewAnswer[] | null> {
		return this.items.filter((item) => !item.deletedAt)
	}

	async findByClientId(clientId: string): Promise<InterviewAnswer[] | null> {
		return this.items.filter(
			(item) => item.clientId.toString() === clientId && !item.deletedAt,
		)
	}

	async findByQuestionId(
		questionId: string,
	): Promise<InterviewAnswer[] | null> {
		return this.items.filter(
			(item) => item.questionId.toString() === questionId && !item.deletedAt,
		)
	}

	async findByClientAndQuestion(
		clientId: string,
		questionId: string,
	): Promise<InterviewAnswer | null> {
		const answer = this.items.find(
			(item) =>
				item.clientId.toString() === clientId &&
				item.questionId.toString() === questionId &&
				!item.deletedAt,
		)
		return answer || null
	}

	async update(interviewAnswer: InterviewAnswer): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.id.equals(interviewAnswer.id),
		)

		if (itemIndex >= 0) {
			this.items[itemIndex] = interviewAnswer
		}
	}

	async delete(interviewAnswer: InterviewAnswer): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.id.equals(interviewAnswer.id),
		)

		if (itemIndex >= 0) {
			this.items[itemIndex].delete()
		}
	}
}
