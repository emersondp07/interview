import { type Either, success } from '@/core/either'
import type { Invoice } from '../../enterprise/entities/invoice'
import type { InvoicesRepository } from '../repositories/invoices-repository'

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
