import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import { Company } from '@/domain/company/entities/company'
import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import type { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { IStripeCustomers } from '@/infra/services/stripe/interfaces/stripe-customers'
import { hash } from 'bcryptjs'
import { Signature } from '../../../domain/company/entities/signature'

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
	{ url: string }
>

export class RegisterCompanyUseCase {
	constructor(
		private companiesRepository: CompaniesRepository,
		private plansRepository: PlansRepository,
		private signaturesRepository: SignaturesRepository,
		private stripeCustomersService: IStripeCustomers,
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

		if (!planExists) {
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
				planExists.stripeProductId,
			)

		await this.signaturesRepository.create(signature)
		await this.companiesRepository.create(company)

		// eviar url para pagamento via email

		return success({
			url: createCheckoutSession.url || 'http://localhost:3000/success',
		})
	}
}
