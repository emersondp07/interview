import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import type { AnswerProps } from './interfaces/answer.type'

export class Answer extends Entity<AnswerProps> {
	get intervirewId() {
		return this.props.intervirewId
	}

	get questionId() {
		return this.props.questionId
	}

	get answerText() {
		return this.props.answerText
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	changeText(answertext: string) {
		this.props.answerText = answertext
		this.touch()
	}

	static create(props: Optional<AnswerProps, 'createdAt' | 'updatedAt'>) {
		const answer = new Answer({
			...props,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})
		return answer
	}
}
