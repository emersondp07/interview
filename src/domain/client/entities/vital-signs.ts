import { AggregateRoot } from '../../core/entities/aggregate-root'
import type { UniqueEntityID } from '../../core/entities/unique-entity'
import type { Optional } from '../../core/types/optional'
import type { VitalSignsProps } from './interfaces/vital-signs.type'

export class VitalSigns extends AggregateRoot<VitalSignsProps> {
	get systolicPressure() {
		return this.props.systolicPressure
	}

	get diastolicPressure() {
		return this.props.diastolicPressure
	}

	get heartRate() {
		return this.props.heartRate
	}

	get temperature() {
		return this.props.temperature
	}

	get weight() {
		return this.props.weight
	}

	get height() {
		return this.props.height
	}

	get respiratoryRate() {
		return this.props.respiratoryRate
	}

	get oxygenSaturation() {
		return this.props.oxygenSaturation
	}

	get glucose() {
		return this.props.glucose
	}

	get observations() {
		return this.props.observations
	}

	get measuredAt() {
		return this.props.measuredAt
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

	private touch() {
		this.props.updatedAt = new Date()
	}

	updatePressure(systolic: number, diastolic: number) {
		this.props.systolicPressure = systolic
		this.props.diastolicPressure = diastolic
		this.touch()
	}

	updateHeartRate(heartRate: number) {
		this.props.heartRate = heartRate
		this.touch()
	}

	updateTemperature(temperature: number) {
		this.props.temperature = temperature
		this.touch()
	}

	updateWeight(weight: number) {
		this.props.weight = weight
		this.touch()
	}

	updateHeight(height: number) {
		this.props.height = height
		this.touch()
	}

	updateRespiratoryRate(respiratoryRate: number) {
		this.props.respiratoryRate = respiratoryRate
		this.touch()
	}

	updateOxygenSaturation(oxygenSaturation: number) {
		this.props.oxygenSaturation = oxygenSaturation
		this.touch()
	}

	updateGlucose(glucose: number) {
		this.props.glucose = glucose
		this.touch()
	}

	updateObservations(observations: string) {
		this.props.observations = observations
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
		props: Optional<VitalSignsProps, 'createdAt' | 'updatedAt' | 'measuredAt'>,
		id?: UniqueEntityID,
	) {
		const vitalSigns = new VitalSigns(
			{
				...props,
				measuredAt: props.measuredAt ?? new Date(),
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return vitalSigns
	}
}
