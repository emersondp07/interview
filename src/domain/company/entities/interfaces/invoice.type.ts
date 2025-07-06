import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum STATUS_PAYMENT {
	OPEN = 'OPEN',
	PAID = 'PAID',
	PENDING = 'PENDING',
	CANCELED = 'CANCELED',
	REBUND = 'REBUND',
	DEFEATED = 'DEFEATED',
}

export interface InvoiceProps {
	mounth: string
	value: string
	issueDate: Date
	dueDate: Date
	paymentDate?: Date
	status: STATUS_PAYMENT
	signatureId: UniqueEntityID
	stripeInvoiceId: string
}
