import type { InterviewList } from '../../../application/company/use-cases/interview-list'
import { ROLE } from '../../administrator/entities/interfaces/adminitrator.type'
import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { ClientProps } from './interfaces/client.type'

export class Client extends AggregateRoot<ClientProps> {
	get name() {
		return this.props.name
	}

	get documentType() {
		return this.props.documentType
	}

	get document() {
		return this.props.document
	}

	get phone() {
		return this.props.phone
	}

	get birthDate() {
		return this.props.birthDate
	}

	get age() {
		return this.props.age
	}

	get gender() {
		return this.props.gender
	}

	get email() {
		return this.props.email
	}

	get emergencyContact() {
		return this.props.emergencyContact
	}

	get emergencyPhone() {
		return this.props.emergencyPhone
	}

	get medicalHistory() {
		return this.props.medicalHistory
	}

	get allergies() {
		return this.props.allergies
	}

	get medications() {
		return this.props.medications
	}

	get role() {
		return this.props.role
	}

	get interviews() {
		return this.props.interviews
	}

	get companyId() {
		return this.props.companyId
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

	addInterview(interviews: InterviewList) {
		this.props.interviews = interviews
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
