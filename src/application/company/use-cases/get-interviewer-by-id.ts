import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import type { ROLE } from '../../../domain/administrator/entities/interfaces/adminitrator.type'
import type { CompaniesRepository } from '../../../domain/administrator/repositories/companies-repository'

interface GetInterviewerByIdUseCaseRequest {
	userId: string
	interviewerId: string
	role: ROLE
}

type GetInterviewerByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interviewer: Interviewer | null }
>

export class GetInterviewerByIdUseCase {
	constructor(
		private readonly interviewersRepository: InterviewersRepository,
		private readonly companiesRepository: CompaniesRepository,
	) {}

	async execute({
		userId,
		interviewerId,
		role,
	}: GetInterviewerByIdUseCaseRequest): Promise<GetInterviewerByIdUseCaseResponse> {
		const interviewer =
			await this.interviewersRepository.findById(interviewerId)

		if (!interviewer) {
			return failed(new ResourceNotFoundError())
		}

		return success({ interviewer })
	}
}
