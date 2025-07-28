import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { InterviewersRepository } from '@/domain/interviewer/repositories/interviewers-repository'
import type { IResendEmails } from '@/infra/services/email/interfaces/resend-emails'
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
		private resendEmailsService: IResendEmails,
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

		const passwordHash = await hash(password, 10)

		const interviewer = Interviewer.create({
			name,
			email,
			password: passwordHash,
			companyId: company.id,
		})

		await this.interviewersRepository.create(interviewer)

		await this.resendEmailsService.sendEmail(
			interviewer.email,
			'Entrevistador cadastrado com sucesso',
			`<p>Olá ${interviewer.name},</p>
			<p>Agora você pode acessar o sistema utilizando seu e-mail e a seguinte senha:</p>
			<p>${passwordHash}</p>
			<p>Com isso, você poderá gerenciar suas entrevistas de forma prática e eficiente.</p>
			<p>Atenciosamente,<br>Equipe de Atendimento</p>`,
		)

		return success({
			interviewer,
		})
	}
}
