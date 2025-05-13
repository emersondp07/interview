import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import { ROLE } from '../../../administrator/enterprise/entities/interfaces/adminitrator.type'
import type { ClientProps } from './interfaces/client.type'

export class Client extends Entity<ClientProps> {
	get name() {
		return this.props.name
	}

	get phone() {
		return this.props.phone
	}

	get email() {
		return this.props.email
	}

	get birthDate() {
		return this.props.birthDate
	}

	get document() {
		return this.props.document
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

	changeName(name: string) {
		this.props.name = name
		this.touch()
	}

	changePhone(phone: string) {
		this.props.phone = phone
		this.touch()
	}

	changeEmail(email: string) {
		this.props.email = email
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<ClientProps, 'createdAt' | 'updatedAt' | 'role'>,
		id?: UniqueEntityID,
	) {
		const client = new Client(
			{
				...props,
				role: ROLE.CLIENT,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return client
	}
}
