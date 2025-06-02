import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { Optional } from '@/core/types/optional'
import { ROLE } from '../../../administrator/enterprise/entities/interfaces/adminitrator.type'
import { DOCUMENT_TYPE } from '../../../client/enterprise/entities/interfaces/client.type'
import type { CompanyProps } from './interfaces/company.type'

export class Company extends Entity<CompanyProps> {
	get corporateReason() {
		return this.props.corporateReason
	}

	get cnpj() {
		return this.props.cnpj
	}

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

	get planId() {
		return this.props.planId
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
		props: Optional<
			CompanyProps,
			'createdAt' | 'updatedAt' | 'role' | 'documentType'
		>,
		id?: UniqueEntityID,
	) {
		const client = new Company(
			{
				...props,
				documentType: DOCUMENT_TYPE.CNPJ,
				role: ROLE.COMPANY,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return client
	}
}
