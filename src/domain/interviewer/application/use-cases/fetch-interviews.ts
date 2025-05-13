import { type Either, success } from '@/core/either'
import type { Interview } from '../../enterprise/entities/interview'
import type { InterviewsRepository } from '../repositories/interviews-repository'

interface FetchInterviewersUseCaseRequest {
	page: number
}

type FetchInterviewersUseCaseResponse = Either<
	null,
	{ interviews: Interview[] | null }
>

export class FetchInterviewsUseCase {
	constructor(private interviewsRepository: InterviewsRepository) {}

	async execute({
		page,
	}: FetchInterviewersUseCaseRequest): Promise<FetchInterviewersUseCaseResponse> {
		const interviews = await this.interviewsRepository.findAll({ page })

		return success({ interviews })
	}
}
