import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { AppointmentProps } from './interfaces/appointment.type'
import { STATUS_APPOINTMENT } from './interfaces/appointment.type'

export class Appointment extends AggregateRoot<AppointmentProps> {
	get status() {
		return this.props.status
	}

	get scheduledAt() {
		return this.props.scheduledAt
	}

	get clientId() {
		return this.props.clientId
	}

	get interviewerId() {
		return this.props.interviewerId
	}

	get specialty() {
		return this.props.specialty
	}

	get triageId() {
		return this.props.triageId
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

	changeStatus(status: STATUS_APPOINTMENT) {
		this.props.status = status
		this.touch()
	}

	reschedule(scheduledAt: Date) {
		this.props.scheduledAt = scheduledAt
		this.touch()
	}

	assignInterviewer(interviewerId: UniqueEntityID) {
		this.props.interviewerId = interviewerId
		this.touch()
	}

	assignTriage(triageId: UniqueEntityID) {
		this.props.triageId = triageId
		this.touch()
	}

	assignInterview(interviewId: UniqueEntityID) {
		this.props.interviewId = interviewId
		this.touch()
	}

	cancel() {
		this.props.status = STATUS_APPOINTMENT.CANCELED
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<AppointmentProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const appointment = new Appointment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return appointment
	}
}
