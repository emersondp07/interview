import { type Either, success } from '@/domain/core/either'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

interface FetchClientAnswersUseCaseRequest {
	clientId: string
}

type FetchClientAnswersUseCaseResponse = Either<
	null,
	{ interviewAnswers: InterviewAnswer[] }
>

export class FetchClientAnswersUseCase {
	constructor(
		private readonly interviewAnswersRepository: InterviewAnswersRepository,
	) {}

	async execute({
		clientId,
	}: FetchClientAnswersUseCaseRequest): Promise<FetchClientAnswersUseCaseResponse> {
		const interviewAnswers =
			await this.interviewAnswersRepository.findByClientId(clientId)

		return success({
			interviewAnswers: interviewAnswers || [],
		})
	}
}
