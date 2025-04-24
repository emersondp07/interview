import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import { ROLE } from './interfaces/adminitrator.type'
import type { InterviewerProps } from './interfaces/interviewer.type'

export class Interviewer extends Entity<InterviewerProps> {
	get name() {
		return this.props.name
	}

	get email() {
		return this.props.email
	}

	get password() {
		return this.props.password
	}

	get role() {
		return this.props.role
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

	changeEmail(email: string) {
		this.props.email = email
		this.touch()
	}

	changePassword(password: string) {
		this.props.password = password
		this.touch()
	}

	changeName(name: string) {
		this.props.name = name
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<InterviewerProps, 'role' | 'createdAt' | 'updatedAt'>,
	) {
		const interviewer = new Interviewer({
			...props,
			role: ROLE.INTERVIEWER,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})

		return interviewer
	}
}
