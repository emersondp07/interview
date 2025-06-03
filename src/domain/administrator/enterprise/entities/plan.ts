import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import type { PlanProps } from './interfaces/plan.type'

export class Plan extends Entity<PlanProps> {
	get name() {
		return this.props.name
	}

	get price() {
		return this.props.price
	}

	get interviewLimit() {
		return this.props.interviewLimit
	}

	get description() {
		return this.props.description
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

	private touch() {
		this.props.updatedAt = new Date()
	}

	changeName(name: string) {
		this.props.name = name
		this.touch()
	}

	changePrice(price: string) {
		this.props.price = price
		this.touch()
	}

	changeInterviewLimit(interviewLimit: number) {
		this.props.interviewLimit = interviewLimit
		this.touch()
	}

	changeDescription(description: string) {
		this.props.description = description
		this.touch()
	}

	static create(
		props: Optional<PlanProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const plan = new Plan(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return plan
	}
}
