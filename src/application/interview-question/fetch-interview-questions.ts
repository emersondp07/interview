import { type Either, success } from '@/domain/core/either'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'

interface FetchInterviewQuestionsUseCaseRequest {
	page: number
}

type FetchInterviewQuestionsUseCaseResponse = Either<
	null,
	{ interviewQuestions: InterviewQuestion[] }
>

export class FetchInterviewQuestionsUseCase {
	constructor(
		private readonly interviewQuestionsRepository: InterviewQuestionsRepository,
	) {}

	async execute({
		page,
	}: FetchInterviewQuestionsUseCaseRequest): Promise<FetchInterviewQuestionsUseCaseResponse> {
		const interviewQuestions = await this.interviewQuestionsRepository.findAll({
			page,
		})

		return success({
			interviewQuestions: interviewQuestions || [],
		})
	}
}
