import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import {
	PRESCRIPTION_STATUS,
	type PrescriptionProps,
} from './interfaces/prescription.type'

export class Prescription extends AggregateRoot<PrescriptionProps> {
	get status() {
		return this.props.status
	}

	get diagnosis() {
		return this.props.diagnosis
	}

	get instructions() {
		return this.props.instructions
	}

	get clientId() {
		return this.props.clientId
	}

	get interviewerId() {
		return this.props.interviewerId
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

	changeStatus(status: PRESCRIPTION_STATUS) {
		this.props.status = status
		this.touch()
	}

	updateDiagnosis(diagnosis: string) {
		this.props.diagnosis = diagnosis
		this.touch()
	}

	updateInstructions(instructions: string) {
		this.props.instructions = instructions
		this.touch()
	}

	assignToInterview(interviewId: UniqueEntityID) {
		this.props.interviewId = interviewId
		this.touch()
	}

	cancel() {
		this.props.status = PRESCRIPTION_STATUS.CANCELED
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<PrescriptionProps, 'createdAt' | 'updatedAt' | 'status'>,
		id?: UniqueEntityID,
	) {
		const prescription = new Prescription(
			{
				...props,
				status: props.status ?? PRESCRIPTION_STATUS.ACTIVE,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return prescription
	}
}
