import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import type {
	InterviewProps,
	STATUS_INTERVIEW,
} from './interfaces/interview.type'

export class Interview extends Entity<InterviewProps> {
	get clientId() {
		return this.props.clientId
	}

	get interviewerId() {
		return this.props.interviewerId
	}

	get status() {
		return this.props.status
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

	changeStatus(status: STATUS_INTERVIEW) {
		this.props.status = status
		this.touch()
	}

	static create(props: Optional<InterviewProps, 'createdAt' | 'updatedAt'>) {
		const interview = new Interview({
			...props,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})

		return interview
	}
}
