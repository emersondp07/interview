import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { hash } from 'bcryptjs'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import type { InterviewersRepository } from '../../../interviewer/application/repositories/interviewers-repository'
import { Interviewer } from '../../../interviewer/enterprise/entities/interviewer'

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
