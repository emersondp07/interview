import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '../../../../core/types/optional'
import {
	STATUS_SIGNATURE,
	type SignatureProps,
} from './interfaces/signature.type'

export class Signature extends Entity<SignatureProps> {
	get companyId() {
		return this.props.companyId
	}

	get planId() {
		return this.props.planId
	}

	get startValidity() {
		return this.props.startValidity
	}

	get endValidity() {
		return this.props.endValidity
	}

	get status() {
		return this.props.status
	}

	cancel() {
		this.props.status = STATUS_SIGNATURE.CANCELED
		this.props.endValidity = new Date()
	}

	static create(
		props: Optional<SignatureProps, 'status' | 'startValidity'>,
		id?: UniqueEntityID,
	) {
		const signature = new Signature(
			{
				...props,
				status: props.status ?? STATUS_SIGNATURE.ACTIVE,
				startValidity: props.startValidity ?? new Date(),
			},
			id,
		)

		return signature
	}
}
