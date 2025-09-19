import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type {
	MEDICATION_FREQUENCY,
	MedicationProps,
} from './interfaces/medication.type'

export class Medication extends AggregateRoot<MedicationProps> {
	get name() {
		return this.props.name
	}

	get dosage() {
		return this.props.dosage
	}

	get frequency() {
		return this.props.frequency
	}

	get duration() {
		return this.props.duration
	}

	get instructions() {
		return this.props.instructions
	}

	get prescriptionId() {
		return this.props.prescriptionId
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

	changeName(name: string) {
		this.props.name = name
		this.touch()
	}

	changeDosage(dosage: string) {
		this.props.dosage = dosage
		this.touch()
	}

	changeFrequency(frequency: MEDICATION_FREQUENCY) {
		this.props.frequency = frequency
		this.touch()
	}

	changeDuration(duration: string) {
		this.props.duration = duration
		this.touch()
	}

	updateInstructions(instructions: string) {
		this.props.instructions = instructions
		this.touch()
	}

	delete() {
		this.props.deletedAt = new Date()
		this.touch()
	}

	static create(
		props: Optional<MedicationProps, 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID,
	) {
		const medication = new Medication(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return medication
	}
}
