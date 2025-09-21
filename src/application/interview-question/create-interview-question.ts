import { type Either, success } from '@/domain/core/either'
import { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface CreateInterviewQuestionUseCaseRequest {
	question: string
	options: string[]
	required?: boolean
}

type CreateInterviewQuestionUseCaseResponse = Either<
	null,
	{ interviewQuestion: InterviewQuestion }
>

export class CreateInterviewQuestionUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		question,
		options,
		required = true,
	}: CreateInterviewQuestionUseCaseRequest): Promise<CreateInterviewQuestionUseCaseResponse> {
		const interviewQuestion = InterviewQuestion.create({
			question,
			options,
			required,
		})

		await this.interviewQuestionsRepository.create(interviewQuestion)

		return success({
			interviewQuestion,
		})
	}
}
