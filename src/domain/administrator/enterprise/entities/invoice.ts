import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import { type InvoiceProps, STATUS_PAYMENT } from './interfaces/invoice.type'

export class Invoice extends Entity<InvoiceProps> {
	get mouth() {
		return this.props.mounth
	}

	get value() {
		return this.props.value
	}

	get issueDate() {
		return this.props.issueDate
	}

	get dueDate() {
		return this.props.dueDate
	}

	get paymentDate() {
		return this.props.paymentDate
	}

	get status() {
		return this.props.status
	}

	get signatureId() {
		return this.props.signatureId
	}

	get planId() {
		return this.props.planId
	}

	addPaymentDate(paymentDate: Date) {
		this.props.paymentDate = paymentDate
		this.props.status = STATUS_PAYMENT.PAID
	}

	static create(
		props: Optional<InvoiceProps, 'issueDate' | 'dueDate'>,
		id?: UniqueEntityID,
	) {
		const invoice = new Invoice(
			{
				...props,
				issueDate: props.issueDate ?? new Date(),
				dueDate: props.dueDate ?? new Date(),
			},
			id,
		)

		return invoice
	}
}
