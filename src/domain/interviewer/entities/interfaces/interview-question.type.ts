import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export interface InterviewQuestionProps {
	question: string
	options: string[]
	required: boolean
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	interviewId?: UniqueEntityID
}
