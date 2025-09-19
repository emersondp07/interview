import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { InterviewAnswerProps } from './interfaces/interview-answer.type'

export class InterviewAnswer extends AggregateRoot<InterviewAnswerProps> {
	get clientId() {
		return this.props.clientId
	}

	get questionId() {
		return this.props.questionId
	}

	get selectedOption() {
		return this.props.selectedOption
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

	changeSelectedOption(selectedOption: string) {
		this.props.selectedOption = selectedOption
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<InterviewAnswerProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const interviewAnswer = new InterviewAnswer(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return interviewAnswer
	}
}
