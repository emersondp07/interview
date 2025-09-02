import { ROLE } from '../../administrator/entities/interfaces/adminitrator.type'
import { DOCUMENT_TYPE } from '../../client/entities/interfaces/client.type'
import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { CompanyProps } from './interfaces/company.type'
import type { Signature } from './signature'

export class Company extends AggregateRoot<CompanyProps> {
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

	get signature() {
		return this.props.signature
	}

	get stripeCustomerId() {
		return this.props.stripeCustomerId
	}

	touch() {
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

	addSignature(signature: Signature) {
		this.props.signature = signature
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
		const company = new Company(
			{
				...props,
				documentType: DOCUMENT_TYPE.CNPJ,
				role: ROLE.COMPANY,
				signature: props.signature,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return company
	}
}
