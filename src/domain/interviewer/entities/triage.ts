import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { TriageProps } from './interfaces/triage.type'

export class Triage extends AggregateRoot<TriageProps> {
	get notes() {
		return this.props.notes
	}

	get vitalSigns() {
		return this.props.vitalSigns
	}

	get nurseName() {
		return this.props.nurseName
	}

	get clientId() {
		return this.props.clientId
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

	updateNotes(notes: string) {
		this.props.notes = notes
		this.touch()
	}

	updateVitalSigns(vitalSigns: any) {
		this.props.vitalSigns = vitalSigns
		this.touch()
	}

	changeNurseName(nurseName: string) {
		this.props.nurseName = nurseName
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	toJSON() {
		return {
			id: this.id.toString(),
			notes: this.notes,
			vitalSigns: this.vitalSigns,
			nurseName: this.nurseName,
			clientId: this.clientId.toString(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
		}
	}

	static create(
		props: Optional<TriageProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const triage = new Triage(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return triage
	}
}
