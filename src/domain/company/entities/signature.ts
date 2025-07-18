import { Entity } from '../../core/entities/entity'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import {
	STATUS_SIGNATURE,
	type SignatureProps,
} from './interfaces/signature.type'

export class Signature extends Entity<SignatureProps> {
	get startValidity() {
		return this.props.startValidity
	}

	get endValidity() {
		return this.props.endValidity
	}

	get status() {
		return this.props.status
	}

	get planId() {
		return this.props.planId
	}

	get companyId() {
		return this.props.companyId
	}

	get stripeSubscriptionId() {
		return this.props.stripeSubscriptionId
	}

	get stripeSubscriptionStatus() {
		return this.props.stripeSubscriptionStatus
	}

	changeActive(subscriptionId: string, stripeSubscriptionStatus: string) {
		this.props.status = STATUS_SIGNATURE.ACTIVE
		this.props.stripeSubscriptionId = subscriptionId
		this.props.stripeSubscriptionStatus = stripeSubscriptionStatus
		this.props.endValidity = new Date()
	}

	cancel() {
		this.props.status = STATUS_SIGNATURE.CANCELED
		this.props.endValidity = new Date()
	}

	static create(
		props: Optional<
			SignatureProps,
			| 'status'
			| 'startValidity'
			| 'stripeSubscriptionId'
			| 'stripeSubscriptionStatus'
		>,
		id?: UniqueEntityID,
	) {
		const signature = new Signature(
			{
				...props,
				status: STATUS_SIGNATURE.CHECKOUT,
				startValidity: props.startValidity ?? new Date(),
			},
			id,
		)

		return signature
	}
}
