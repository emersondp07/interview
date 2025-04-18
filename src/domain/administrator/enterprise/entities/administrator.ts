import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import { type AdministratorProps, ROLE } from './interfaces/adminitrator.type'

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
		props: Optional<AdministratorProps, 'createdAt' | 'updatedAt' | 'role'>,
		id?: UniqueEntityID,
	) {
		const administrator = new Administrator(
			{
				...props,
				role: ROLE.ADMIN,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)
		return administrator
	}
}
