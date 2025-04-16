import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import type { ClientProps } from './interfaces/client.type'

export class Client extends Entity<ClientProps> {
	get name(): string {
		return this.props.name
	}

	get documentType(): string {
		return this.props.documentType
	}

	get document(): string {
		return this.props.document
	}

	get birthDate(): Date {
		return this.props.birthDate
	}

	get phone(): string {
		return this.props.phone
	}

	get email(): string {
		return this.props.email
	}

	get address(): string {
		return this.props.address
	}

	get createdAt(): Date {
		return this.props.createdAt
	}

	get updatedAt(): Date {
		return this.props.updatedAt
	}

	get deletedAt(): Date | undefined {
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

	changeAddress(address: string) {
		this.props.address = address
		this.touch()
	}

	static create(props: Optional<ClientProps, 'createdAt' | 'updatedAt'>) {
		const client = new Client({
			...props,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})

		return client
	}
}
