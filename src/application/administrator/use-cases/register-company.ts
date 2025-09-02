import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import { Company } from '@/domain/company/entities/company'
import { Signature } from '@/domain/company/entities/signature'
import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import type { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { IResendEmails } from '@/infra/services/email/interfaces/resend-emails'
import type { IStripeCustomers } from '@/infra/services/stripe/interfaces/stripe-customers'
import { hash } from 'bcryptjs'

interface RegisterCompanyUseCaseRequest {
	corporateReason: string
	cnpj: string
	email: string
	password: string
	phone: string
	planId: string
}

type RegisterCompanyUseCaseResponse = Either<
	ResourceNotFoundError,
	{ company: Company }
>

export class RegisterCompanyUseCase {
	constructor(
		private readonly companiesRepository: CompaniesRepository,
		private readonly plansRepository: PlansRepository,
		private readonly signaturesRepository: SignaturesRepository,
		private readonly stripeCustomersService: IStripeCustomers,
		private readonly resendEmailsService: IResendEmails,
	) {}

	async execute({
		corporateReason,
		cnpj,
		email,
		password,
		phone,
		planId,
	}: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
		let company = await this.companiesRepository.findByEmail(email)

		const planExists = await this.plansRepository.findById(planId)

		if (!planExists || !planExists.stripePriceId) {
			return failed(new NotAllowedError())
		}

		if (company) {
			return failed(new NotAllowedError())
		}

		const customer = await this.stripeCustomersService.createCustomer(
			email,
			corporateReason,
		)

		company = Company.create({
			corporateReason,
			cnpj,
			email,
			password: await hash(password, 10),
			phone,
			planId,
			stripeCustomerId: customer.id,
		})

		const signature = Signature.create({
			companyId: company.id,
			planId: planExists.id,
		})

		company.addSignature(signature)

		const createCheckoutSession =
			await this.stripeCustomersService.createCheckoutSession(
				company.id.toString(),
				customer.id,
				planExists.stripePriceId,
			)

		await this.signaturesRepository.create(signature)
		await this.companiesRepository.create(company)

		await this.resendEmailsService.sendEmail(
			company.email,
			'Assinatura criada com sucesso',
			`<p>Olá ${company.corporateReason},</p>
			<p>Sua assinatura foi criada com sucesso. Acesse o seguinte link para completar o processo de pagamento:</p>
			<p><a href="${createCheckoutSession.url}">Pagar Assinatura</a></p>
			<p>Obrigado por escolher nossos serviços!</p>`,
		)

		return success({ company })
	}
}
