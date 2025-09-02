import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { Interview } from '../../../domain/interviewer/entities/interview'
import type { InterviewsRepository } from '../../../domain/interviewer/repositories/interviews-repository'

interface GetInterviewUseCaseRequest {
	interviewId: string
}

type GetInterviewUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview | null }
>

export class GetInterviewByIdUseCase {
	constructor(private interviewsRepository: InterviewsRepository) {}

	async execute({
		interviewId,
	}: GetInterviewUseCaseRequest): Promise<GetInterviewUseCaseResponse> {
		const interview =
			await this.interviewsRepository.getDetailsById(interviewId)

		if (!interview) {
			return failed(new ResourceNotFoundError())
		}

		return success({ interview })
	}
}
