import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import { hash } from 'bcryptjs'

interface CreateInterviewerUseCaseRequest {
	name: string
	email: string
	password: string
	companyId: string
}

type CreateInterviewerUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interviewer: Interviewer }
>

export class CreateInterviewerUseCase {
	constructor(
		private interviewersRepository: InterviewersRepository,
		private companiesRepository: CompaniesRepository,
	) {}

	async execute({
		name,
		email,
		password,
		companyId,
	}: CreateInterviewerUseCaseRequest): Promise<CreateInterviewerUseCaseResponse> {
		const company = await this.companiesRepository.findById(companyId)

		if (!company) {
			return failed(new ResourceNotFoundError())
		}

		const interviewer = Interviewer.create({
			name,
			email,
			password: await hash(password, 10),
			companyId: company.id,
		})

		await this.interviewersRepository.create(interviewer)

		return success({
			interviewer,
		})
	}
}
