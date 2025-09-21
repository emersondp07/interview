import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface UpdateInterviewQuestionUseCaseRequest {
	questionId: string
	question?: string
	options?: string[]
	required?: boolean
}

type UpdateInterviewQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interviewQuestion: InterviewQuestion }
>

export class UpdateInterviewQuestionUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		questionId,
		question,
		options,
		required,
	}: UpdateInterviewQuestionUseCaseRequest): Promise<UpdateInterviewQuestionUseCaseResponse> {
		const interviewQuestion =
			await this.interviewQuestionsRepository.findById(questionId)

		if (!interviewQuestion) {
			return failed(new ResourceNotFoundError())
		}

		if (question) {
			interviewQuestion.changeQuestion(question)
		}

		if (options) {
			interviewQuestion.updateOptions(options)
		}

		if (required !== undefined) {
			if (required !== interviewQuestion.required) {
				interviewQuestion.toggleRequired()
			}
		}

		await this.interviewQuestionsRepository.update(
			questionId,
			interviewQuestion,
		)

		return success({
			interviewQuestion,
		})
	}
}
