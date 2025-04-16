import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import type { CompanyProps } from './interfaces/company.type'

export class Company extends Entity<CompanyProps> {
	get corporateReason() {
		return this.props.corporateReason
	}

	get documentType() {
		return this.props.documentType
	}

	get cnpj() {
		return this.props.cnpj
	}

	get email() {
		return this.props.email
	}

	get phone() {
		return this.props.phone
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

	static create(props: Optional<CompanyProps, 'createdAt' | 'updatedAt'>) {
		const client = new Company({
			...props,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		})

		return client
	}
}
