import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import type { QuestionProps } from './interfaces/question.type'

export class Question extends Entity<QuestionProps> {
	get text() {
		return this.props.text
	}

	get mandatory() {
		return this.props.mandatory
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get companyId() {
		return this.props.companyId
	}

	get answerId() {
		return this.props.answerId
	}

	createAnswer(answerId: UniqueEntityID) {
		this.props.answerId = answerId
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<QuestionProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const question = new Question(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return question
	}
}
