import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface CreateInvoiceUseCaseRequest {
	mounth: string
	value: string
	companyId: string
	stripeInvoiceId: string
}

type CreateInvoiceUseCaseResponse = Either<
	ResourceNotFoundError,
	{ invoice: Invoice }
>

export class CreateInvoiceUseCase {
	constructor(
		private readonly invoicesRepository: InvoicesRepository,
		private readonly companiesRepository: CompaniesRepository,
	) {}

	async execute({
		mounth,
		value,
		companyId,
		stripeInvoiceId,
	}: CreateInvoiceUseCaseRequest): Promise<CreateInvoiceUseCaseResponse> {
		const isExistCompany =
			await this.companiesRepository.findByCustomerId(companyId)

		if (!isExistCompany?.signature?.id.toString()) {
			return failed(new ResourceNotFoundError())
		}

		const invoice = Invoice.create({
			mounth,
			value,
			signatureId: isExistCompany.signature?.id,
			stripeInvoiceId,
		})

		await this.invoicesRepository.create(invoice)

		return success({ invoice })
	}
}
