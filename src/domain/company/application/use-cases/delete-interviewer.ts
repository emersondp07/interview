import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { InterviewersRepository } from '../../../interviewer/application/repositories/interviewers-repository'

interface DeleteInterviewerUseCaseRequest {
	interviewerId: string
	companyId: string
}

type DeleteInterviewerUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteInterviewerUseCase {
	constructor(private interviewersRepository: InterviewersRepository) {}

	async execute({
		interviewerId,
		companyId,
	}: DeleteInterviewerUseCaseRequest): Promise<DeleteInterviewerUseCaseResponse> {
		const interviewer =
			await this.interviewersRepository.findById(interviewerId)

		if (!interviewer) {
			return failed(new ResourceNotFoundError())
		}

		await this.interviewersRepository.delete(interviewerId)

		return success({})
	}
}
