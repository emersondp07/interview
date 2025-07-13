import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import { type Either, failed, success } from '@/domain/core/either'
import type { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface CancelInvoiceUseCaseRequest {
	invoiceId: string
	signatureId: string
}

type CancelInvoiceUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>

export class CancelInvoiceUseCase {
	constructor(private invoicesRepository: InvoicesRepository) {}

	async execute({
		invoiceId,
		signatureId,
	}: CancelInvoiceUseCaseRequest): Promise<CancelInvoiceUseCaseResponse> {
		const invoice = await this.invoicesRepository.findById(invoiceId)

		if (!invoice) {
			return failed(new ResourceNotFoundError())
		}

		await this.invoicesRepository.delete(invoice)

		return success({})
	}
}
