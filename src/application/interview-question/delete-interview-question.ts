import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface DeleteInterviewQuestionUseCaseRequest {
	questionId: string
}

type DeleteInterviewQuestionUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteInterviewQuestionUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		questionId,
	}: DeleteInterviewQuestionUseCaseRequest): Promise<DeleteInterviewQuestionUseCaseResponse> {
		const interviewQuestion =
			await this.interviewQuestionsRepository.findById(questionId)

		if (!interviewQuestion) {
			return failed(new ResourceNotFoundError())
		}

		interviewQuestion.delete()

		await this.interviewQuestionsRepository.update(questionId, interviewQuestion)

		return success({})
	}
}
