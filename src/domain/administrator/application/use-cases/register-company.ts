import { type Either, failed, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import type { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { hash } from 'bcryptjs'
import type { StripeCustomersService } from '../../../../infra/services/stripe/customers'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import type { PlansRepository } from '../../../administrator/application/repositories/plans-repository'
import type { SignaturesRepository } from '../../../company/application/repositories/signatures-repository'
import { Company } from '../../../company/enterprise/entities/company'
import { Signature } from '../../../company/enterprise/entities/signature'

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
		private stripeCustomersService: StripeCustomersService,
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

		const createCheckoutSession =
			await this.stripeCustomersService.createCheckoutSession(
				company.id.toString(),
				customer.id,
				planExists.stripeProductId,
			)

		const signature = Signature.create({
			companyId: company.id,
			planId: planExists.id,
		})

		await this.companiesRepository.create(company)
		await this.signaturesRepository.create(signature)

		return success({
			url: createCheckoutSession.url || 'http://localhost:3000/success',
		})
	}
}
