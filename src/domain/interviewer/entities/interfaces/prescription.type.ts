import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum PRESCRIPTION_STATUS {
	ACTIVE = 'ACTIVE',
	COMPLETED = 'COMPLETED',
	SUSPENDED = 'SUSPENDED',
	CANCELED = 'CANCELED',
}

export interface PrescriptionProps {
	status: PRESCRIPTION_STATUS
	diagnosis: string
	instructions?: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	clientId: UniqueEntityID
	interviewerId: UniqueEntityID
	interviewId?: UniqueEntityID
}
