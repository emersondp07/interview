import type { UniqueEntityID } from '@/core/entities/unique-entity'

export interface QuestionProps {
	text: string
	mandatory: boolean
	createdAt: Date
	updatedAt: Date
	answerId?: UniqueEntityID
	companyId: UniqueEntityID
}
