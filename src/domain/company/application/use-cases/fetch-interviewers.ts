import { type Either, success } from '@/core/either'
import type { InterviewersRepository } from '../../../interviewer/application/repositories/interviewers-repository'
import type { Interviewer } from '../../../interviewer/enterprise/entities/interviewer'

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
