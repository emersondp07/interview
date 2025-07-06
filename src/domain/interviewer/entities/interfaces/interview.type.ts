import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum STATUS_INTERVIEW {
	SCHEDULED = 'SCHEDULED',
	IN_PROGRESS = 'IN_PROGRESS',
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	CANCELED = 'CANCELED',
}

export interface InterviewProps {
	clientId: UniqueEntityID
	interviewerId?: UniqueEntityID
	companyId: UniqueEntityID
	status: STATUS_INTERVIEW
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
