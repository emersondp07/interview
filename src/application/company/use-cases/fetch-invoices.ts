import type { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, success } from '@/domain/core/either'

interface FetchInvoicesUseCaseRequest {
	page: number
}

type FetchInvoicesUseCaseResponse = Either<null, { invoices: Invoice[] | null }>

export class FetchInvoicesUseCase {
	constructor(private invoicesRepository: InvoicesRepository) {}

	async execute({
		page,
	}: FetchInvoicesUseCaseRequest): Promise<FetchInvoicesUseCaseResponse> {
		const invoices = await this.invoicesRepository.findAll({ page })

		return success({ invoices })
	}
}
