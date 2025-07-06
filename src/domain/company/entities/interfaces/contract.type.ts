import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export interface ContractProps {
	title: string
	description: string
	imageUrl: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	companyId: UniqueEntityID
}
