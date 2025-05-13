import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import type { Interview } from '../../enterprise/entities/interview'
import type { InterviewsRepository } from '../repositories/interviews-repository'

interface StartInterviewUseCaseRequest {
	interviewId: string
}

type StartInterviewUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview }
>

export class StartInterviewUseCase {
	constructor(private interviewsRepository: InterviewsRepository) {}

	async execute({
		interviewId,
	}: StartInterviewUseCaseRequest): Promise<StartInterviewUseCaseResponse> {
		const interview = await this.interviewsRepository.findById(interviewId)

		if (!interview) {
			return failed(new ResourceNotFoundError())
		}

		if (interview.status !== 'SCHEDULED') {
			return failed(new ResourceNotFoundError())
		}

		interview.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		await this.interviewsRepository.startInterview(interview)

		return success({ interview })
	}
}
