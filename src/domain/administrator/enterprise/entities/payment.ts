import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { PaymentProps } from './interfaces/payment.type'

export class Payment extends Entity<PaymentProps> {
	get signatureId() {
		return this.props.signatureId
	}

	get invoiceId() {
		return this.props.invoiceId
	}

	get method() {
		return this.props.method
	}

	get value_paid() {
		return this.props.value_paid
	}

	get proof_url() {
		return this.props.proof_url
	}

	static create(props: PaymentProps, id?: UniqueEntityID) {
		const payment = new Payment(
			{
				...props,
			},
			id,
		)

		return payment
	}
}
