import type { UniqueEntityID } from '@/core/entities/unique-entity'

export interface AnswerProps {
	intervirewId: UniqueEntityID
	questionId: UniqueEntityID
	answerText: string
	createdAt: Date
	updatedAt: Date
}
