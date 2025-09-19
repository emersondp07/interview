import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface DeleteInterviewQuestionUseCaseRequest {
	interviewQuestionId: string
}

type DeleteInterviewQuestionUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteInterviewQuestionUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		interviewQuestionId,
	}: DeleteInterviewQuestionUseCaseRequest): Promise<DeleteInterviewQuestionUseCaseResponse> {
		const interviewQuestion =
			await this.interviewQuestionsRepository.findById(interviewQuestionId)

		if (!interviewQuestion) {
			return failed(new ResourceNotFoundError())
		}

		await this.interviewQuestionsRepository.delete(interviewQuestionId)

		return success({})
	}
}
