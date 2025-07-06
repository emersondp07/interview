import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import type { Interview } from '@/domain/interviewer/entities/interview'
import type { InterviewsRepository } from '@/domain/interviewer/repositories/interviews-repository'

interface SendContractUseCaseRequest {
	clientId: string
	interviewId: string
}

type SendContractUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview }
>

export class SendContractUseCase {
	constructor(private interviewsRepository: InterviewsRepository) {}

	async execute({
		clientId,
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
