import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import { ROLE } from './interfaces/adminitrator.type'
import type { CompanyProps } from './interfaces/company.type'

export class Company extends Entity<CompanyProps> {
	get email() {
		return this.props.email
	}

	get password() {
		return this.props.password
	}

	get phone() {
		return this.props.phone
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

	changePassword(password: string) {
		this.props.password = password
		this.touch()
	}

	changeEmail(email: string) {
		this.props.email = email
		this.touch()
	}

	changePhone(phone: string) {
		this.props.phone = phone
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<CompanyProps, 'createdAt' | 'updatedAt' | 'role'>,
	) {
		const client = new Company({
			...props,
			role: ROLE.COMPANY,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})

		return client
	}
}
