import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export interface TriageProps {
	notes?: string
	vitalSigns?: any
	nurseName: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	clientId: UniqueEntityID
}
