import { type Either, success } from '@/domain/core/either'
import type { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'

interface FetchInterviewersUseCaseRequest {
	page: number
}

type FetchInterviewersUseCaseResponse = Either<
	null,
	{ interviewers: Interviewer[] | null }
>

export class FetchInterviewersUseCase {
	constructor(private interviewersRepository: InterviewersRepository) {}

	async execute({
		page,
	}: FetchInterviewersUseCaseRequest): Promise<FetchInterviewersUseCaseResponse> {
		const interviewers = await this.interviewersRepository.findAll({ page })

		return success({ interviewers })
	}
}
