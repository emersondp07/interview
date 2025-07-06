import type { ROLE } from '../../../administrator/entities/interfaces/adminitrator.type'
import type { UniqueEntityID } from '../../../core/entities/unique-entity'

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
