import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import type { AdministratorProps } from './interfaces/adminitrator.type'

export class Administrator extends Entity<AdministratorProps> {
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

	private touch() {
		this.props.updatedAt = new Date()
	}

	changeName(name: string) {
		this.props.name = name
		this.touch()
	}

	changeEmail(email: string) {
		this.props.email = email
		this.touch()
	}

	changePassword(password: string) {
		this.props.password = password
		this.touch()
	}

	static create(
		props: Optional<AdministratorProps, 'createdAt' | 'updatedAt'>,
	) {
		const administrator = new Administrator({
			...props,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})
		return administrator
	}
}
