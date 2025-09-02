import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import type { Interview } from '@/domain/interviewer/entities/interview'
import type { InterviewsRepository } from '@/domain/interviewer/repositories/interviews-repository'
import type { InterviewersRepository } from '../../../domain/interviewer/repositories/interviewers-repository'

interface StartInterviewUseCaseRequest {
	clientId: string
	interviewId: string
	interviewerId: string
}

type StartInterviewUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interview: Interview }
>

export class StartInterviewUseCase {
	constructor(
		private clientsRepository: ClientsRepository,
		private interviewsRepository: InterviewsRepository,
		private interviewersRepository: InterviewersRepository,
	) {}

	async execute({
		clientId,
		interviewId,
		interviewerId,
	}: StartInterviewUseCaseRequest): Promise<StartInterviewUseCaseResponse> {
		const client = await this.clientsRepository.findById(clientId)
		const interview = await this.interviewsRepository.findById(interviewId)

		if (!interview || !client) {
			return failed(new ResourceNotFoundError())
		}

		const interviewer =
			await this.interviewersRepository.findById(interviewerId)

		if (!interviewer) {
			return failed(new ResourceNotFoundError())
		}

		if (interview.status !== 'SCHEDULED') {
			return failed(new ResourceNotFoundError())
		}

		interview.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)
		interview.changeInterviewer(interviewer.id)

		await this.interviewsRepository.startInterview(interview)

		return success({ interview })
	}
}
