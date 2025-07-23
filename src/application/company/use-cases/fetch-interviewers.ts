import { type Either, success } from '@/domain/core/either'
import type { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'

interface FetchInterviewersUseCaseRequest {
	companyId: string
	page: number
}

type FetchInterviewersUseCaseResponse = Either<
	null,
	{ interviewers: Interviewer[] | null }
>

export class FetchInterviewersUseCase {
	constructor(private interviewersRepository: InterviewersRepository) {}

	async execute({
		companyId,
		page,
	}: FetchInterviewersUseCaseRequest): Promise<FetchInterviewersUseCaseResponse> {
		const interviewers = await this.interviewersRepository.findAll(companyId, {
			page,
		})

		return success({ interviewers })
	}
}
