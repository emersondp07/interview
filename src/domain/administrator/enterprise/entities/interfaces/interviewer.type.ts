import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { ROLE } from './adminitrator.type'

export interface InterviewerProps {
	name: string
	email: string
	password: string
	role: ROLE.INTERVIEWER
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	companyId: UniqueEntityID
}
