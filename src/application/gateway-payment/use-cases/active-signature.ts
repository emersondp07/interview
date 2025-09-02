import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Signature } from '@/domain/company/entities/signature'
import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { IResendEmails } from '@/infra/services/email/interfaces/resend-emails'

interface ActiveSignatureUseCaseRequest {
	companyId: string
	subscriptionId: string
	stripeSubscriptionStatus: string
}

type ActiveSignatureUseCaseResponse = Either<
	ResourceNotFoundError,
	{ signature: Signature }
>

export class ActiveSignatureUseCase {
	constructor(
		private readonly signaturesRepository: SignaturesRepository,
		private readonly companiesRepository: CompaniesRepository,
		private readonly resendEmailsService: IResendEmails,
	) {}

	async execute({
		companyId,
		subscriptionId,
		stripeSubscriptionStatus,
	}: ActiveSignatureUseCaseRequest): Promise<ActiveSignatureUseCaseResponse> {
		const isExistCompany =
			await this.companiesRepository.findByCustomerId(companyId)

		if (!isExistCompany || !isExistCompany.signature) {
			return failed(new ResourceNotFoundError())
		}

		const signature = await this.signaturesRepository.findById(
			isExistCompany.signature.id.toString(),
		)

		if (!signature) {
			return failed(new ResourceNotFoundError())
		}

		signature.changeActive(subscriptionId, stripeSubscriptionStatus)

		await this.signaturesRepository.update(signature)

		await this.resendEmailsService.sendEmail(
			isExistCompany.email,
			'Sua assinatura foi ativada',
			`<p>Olá ${isExistCompany.corporateReason},</p>
			<p>Sua assinatura foi ativada com sucesso. Agradecemos por escolher nossos serviços!</p>`,
		)

		return success({ signature })
	}
}
