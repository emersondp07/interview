import { type Either, failed, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { InvoicesRepository } from '../../../company/application/repositories/invoices-repository'
import { Invoice } from '../../../company/enterprise/entities/invoice'
import type { STATUS_PAYMENT } from '../../enterprise/entities/interfaces/invoice.type'
import type { SignaturesRepository } from '../repositories/signatures-repository'

interface CreateInvoiceUseCaseRequest {
	mounth: string
	value: string
	status: STATUS_PAYMENT
	signatureId: string
}

type CreateInvoiceUseCaseResponse = Either<
	ResourceNotFoundError,
	{ invoice: Invoice }
>

export class CreateInvoiceUseCase {
	constructor(
		private invoicesRepository: InvoicesRepository,
		private signaturesRepository: SignaturesRepository,
	) {}

	async execute({
		mounth,
		value,
		status,
		signatureId,
	}: CreateInvoiceUseCaseRequest): Promise<CreateInvoiceUseCaseResponse> {
		const isExistSignature =
			await this.signaturesRepository.findById(signatureId)

		if (!isExistSignature) {
			return failed(new ResourceNotFoundError())
		}

		const invoice = Invoice.create({
			mounth,
			value,
			status,
			signatureId: new UniqueEntityID(signatureId),
			planId: isExistSignature.planId,
		})

		await this.invoicesRepository.create(invoice)

		return success({ invoice })
	}
}
