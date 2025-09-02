import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface FetchInvoicesUseCaseRequest {
	companyId: string
	page: number
}

type FetchInvoicesUseCaseResponse = Either<
	ResourceNotFoundError,
	{ invoices: Invoice[] | null }
>

export class FetchInvoicesUseCase {
	constructor(
		private readonly invoicesRepository: InvoicesRepository,
		private readonly companiesRepository: CompaniesRepository,
	) {}

	async execute({
		companyId,
		page,
	}: FetchInvoicesUseCaseRequest): Promise<FetchInvoicesUseCaseResponse> {
		const company = await this.companiesRepository.findById(companyId)

		if (!company || !company.signature) {
			return failed(new ResourceNotFoundError())
		}

		const invoices = await this.invoicesRepository.findAll(
			company.signature.id.toString(),
			{ page },
		)

		return success({ invoices })
	}
}
