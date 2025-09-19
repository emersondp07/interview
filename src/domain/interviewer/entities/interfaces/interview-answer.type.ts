import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export interface InterviewAnswerProps {
	clientId: UniqueEntityID
	questionId: UniqueEntityID
	selectedOption: string
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
}
