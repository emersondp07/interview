import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface PaidInvoiceUseCaseRequest {
	customerId: string
}

type PaidInvoiceUseCaseResponse = Either<
	ResourceNotFoundError,
	{ invoice: Invoice }
>

export class PaidInvoiceUseCase {
	constructor(
		private readonly invoicesRepository: InvoicesRepository,
		private readonly companiesRepository: CompaniesRepository,
	) {}

	async execute({
		customerId,
	}: PaidInvoiceUseCaseRequest): Promise<PaidInvoiceUseCaseResponse> {
		const isExistCompany =
			await this.companiesRepository.findByCustomerId(customerId)

		if (!isExistCompany || !isExistCompany.signature) {
			return failed(new ResourceNotFoundError())
		}

		const invoice = await this.invoicesRepository.findBySignatureId(
			isExistCompany.signature.id.toString(),
		)

		if (!invoice) {
			return failed(new ResourceNotFoundError())
		}

		invoice.addPaymentDate(new Date())

		await this.invoicesRepository.update(invoice)

		return success({ invoice })
	}
}
