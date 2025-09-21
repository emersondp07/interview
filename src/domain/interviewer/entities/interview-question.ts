import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { InterviewQuestionProps } from './interfaces/interview-question.type'

export class InterviewQuestion extends AggregateRoot<InterviewQuestionProps> {
	get question() {
		return this.props.question
	}

	get options() {
		return this.props.options
	}

	get required() {
		return this.props.required
	}

	get interviewId() {
		return this.props.interviewId
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

	touch() {
		this.props.updatedAt = new Date()
	}

	changeQuestion(question: string) {
		this.props.question = question
		this.touch()
	}

	updateOptions(options: string[]) {
		this.props.options = options
		this.touch()
	}

	toggleRequired() {
		this.props.required = !this.props.required
		this.touch()
	}

	assignToInterview(interviewId: UniqueEntityID) {
		this.props.interviewId = interviewId
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	toJSON() {
		return {
			id: this.id.toString(),
			question: this.question,
			options: this.options,
			required: this.required,
			interviewId: this.interviewId?.toString(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
		}
	}

	static create(
		props: Optional<
			InterviewQuestionProps,
			'createdAt' | 'updatedAt' | 'required'
		>,
		id?: UniqueEntityID,
	) {
		const interviewQuestion = new InterviewQuestion(
			{
				...props,
				required: props.required ?? true,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return interviewQuestion
	}
}
