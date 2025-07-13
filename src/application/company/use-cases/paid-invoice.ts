import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface PaidInvoiceUseCaseRequest {
	companyId: string
}

type PaidInvoiceUseCaseResponse = Either<
	ResourceNotFoundError,
	{ invoice: Invoice }
>

export class PaidInvoiceUseCase {
	constructor(
		private invoicesRepository: InvoicesRepository,
		private companiesRepository: CompaniesRepository,
	) {}

	async execute({
		companyId,
	}: PaidInvoiceUseCaseRequest): Promise<PaidInvoiceUseCaseResponse> {
		const isExistCompany = await this.companiesRepository.findById(companyId)

		if (!isExistCompany || !isExistCompany.signature) {
			return failed(new ResourceNotFoundError())
		}

		const invoice = await this.invoicesRepository.findById(
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
