import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { ClientsRepository } from '../../../company/application/repositories/clients-repository'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import type { Interview } from '../../enterprise/entities/interview'
import type { InterviewsRepository } from '../repositories/interviews-repository'

interface FinishInterviewUseCaseRequest {
	clientId: string
	interviewId: string
}

type FinishInterviewUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview }
>

export class FinishInterviewUseCase {
	constructor(
		private clientsRepository: ClientsRepository,
		private interviewsRepository: InterviewsRepository,
	) {}

	async execute({
		clientId,
		interviewId,
	}: FinishInterviewUseCaseRequest): Promise<FinishInterviewUseCaseResponse> {
		const client = await this.clientsRepository.findById(clientId)
		const interview = await this.interviewsRepository.findById(interviewId)

		if (!interview || !client) {
			return failed(new ResourceNotFoundError())
		}

		if (interview.status !== STATUS_INTERVIEW.PENDING) {
			return failed(new ResourceNotFoundError())
		}

		interview.changeStatus(STATUS_INTERVIEW.COMPLETED)

		await this.interviewsRepository.finishInterview(interview)

		return success({ interview })
	}
}
