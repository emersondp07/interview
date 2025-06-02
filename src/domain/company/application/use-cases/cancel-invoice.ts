import { type Either, failed, success } from '@/core/either'
import type { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { InvoicesRepository } from '../../../company/application/repositories/invoices-repository'

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
