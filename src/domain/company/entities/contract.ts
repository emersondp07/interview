import { Entity } from '../../core/entities/entity'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { ContractProps } from './interfaces/contract.type'

export class Contract extends Entity<ContractProps> {
	get title() {
		return this.props.title
	}

	get description() {
		return this.props.description
	}

	get imageUrl() {
		return this.props.imageUrl
	}

	get companyId() {
		return this.props.companyId
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	delete() {
		this.props.deletedAt = new Date()
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<ContractProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const contract = new Contract(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return contract
	}
}
