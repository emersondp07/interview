import { type Either, success } from '@/domain/core/either'
import type { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface FetchQuestionsByInterviewUseCaseRequest {
	interviewId: string
}

type FetchQuestionsByInterviewUseCaseResponse = Either<
	null,
	{ interviewQuestions: InterviewQuestion[] }
>

export class FetchQuestionsByInterviewUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		interviewId,
	}: FetchQuestionsByInterviewUseCaseRequest): Promise<FetchQuestionsByInterviewUseCaseResponse> {
		const interviewQuestions =
			await this.interviewQuestionsRepository.findByInterviewId(interviewId)

		return success({
			interviewQuestions: interviewQuestions || [],
		})
	}
}
