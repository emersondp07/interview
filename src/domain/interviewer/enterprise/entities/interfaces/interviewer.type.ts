import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { ROLE } from '../../../../administrator/enterprise/entities/interfaces/adminitrator.type'

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
