import { type Either, success } from '@/domain/core/either'
import type { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

interface FetchAnswersByInterviewUseCaseRequest {
	interviewId: string
}

type FetchAnswersByInterviewUseCaseResponse = Either<
	null,
	{ interviewAnswers: InterviewAnswer[] }
>

export class FetchAnswersByInterviewUseCase {
	constructor(
		private readonly interviewAnswersRepository: InterviewAnswersRepository,
	) {}

	async execute({
		interviewId,
	}: FetchAnswersByInterviewUseCaseRequest): Promise<FetchAnswersByInterviewUseCaseResponse> {
		const interviewAnswers =
			await this.interviewAnswersRepository.findByInterviewId(interviewId)

		return success({
			interviewAnswers: interviewAnswers || [],
		})
	}
}