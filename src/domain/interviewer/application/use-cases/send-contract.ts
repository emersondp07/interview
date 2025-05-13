import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '../../enterprise/entities/interfaces/interview.type'
import type { Interview } from '../../enterprise/entities/interview'
import type { InterviewsRepository } from '../repositories/interviews-repository'

interface SendContractUseCaseRequest {
	interviewId: string
}

type SendContractUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview }
>

export class SendContractUseCase {
	constructor(private interviewsRepository: InterviewsRepository) {}

	async execute({
		interviewId,
	}: SendContractUseCaseRequest): Promise<SendContractUseCaseResponse> {
		const interview = await this.interviewsRepository.findById(interviewId)

		if (!interview) {
			return failed(new ResourceNotFoundError())
		}

		if (interview.status !== 'IN_PROGRESS') {
			return failed(new ResourceNotFoundError())
		}

		interview.changeStatus(STATUS_INTERVIEW.PENDING)

		await this.interviewsRepository.sendContract(interview)

		return success({ interview })
	}
}
