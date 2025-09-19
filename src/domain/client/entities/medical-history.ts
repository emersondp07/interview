import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type {
	MEDICAL_RECORD_TYPE,
	MedicalHistoryProps,
} from './interfaces/medical-history.type'

export class MedicalHistory extends AggregateRoot<MedicalHistoryProps> {
	get type() {
		return this.props.type
	}

	get title() {
		return this.props.title
	}

	get description() {
		return this.props.description
	}

	get date() {
		return this.props.date
	}

	get doctorName() {
		return this.props.doctorName
	}

	get institution() {
		return this.props.institution
	}

	get files() {
		return this.props.files
	}

	get observations() {
		return this.props.observations
	}

	get clientId() {
		return this.props.clientId
	}

	get interviewId() {
		return this.props.interviewId
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

	touch() {
		this.props.updatedAt = new Date()
	}

	updateTitle(title: string) {
		this.props.title = title
		this.touch()
	}

	updateDescription(description: string) {
		this.props.description = description
		this.touch()
	}

	updateObservations(observations: string) {
		this.props.observations = observations
		this.touch()
	}

	addFile(fileUrl: string) {
		this.props.files.push(fileUrl)
		this.touch()
	}

	removeFile(fileUrl: string) {
		this.props.files = this.props.files.filter((file) => file !== fileUrl)
		this.touch()
	}

	assignToInterview(interviewId: UniqueEntityID) {
		this.props.interviewId = interviewId
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<MedicalHistoryProps, 'createdAt' | 'updatedAt' | 'files'>,
		id?: UniqueEntityID,
	) {
		const medicalHistory = new MedicalHistory(
			{
				...props,
				files: props.files ?? [],
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return medicalHistory
	}
}
