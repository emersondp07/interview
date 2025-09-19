import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export interface VitalSignsProps {
	systolicPressure?: number
	diastolicPressure?: number
	heartRate?: number
	temperature?: number
	weight?: number
	height?: number
	respiratoryRate?: number
	oxygenSaturation?: number
	glucose?: number
	observations?: string
	measuredAt: Date
	createdAt: Date
	updatedAt?: Date
	deletedAt?: Date
	clientId: UniqueEntityID
	interviewId?: UniqueEntityID
}
