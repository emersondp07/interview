import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { DOCUMENT_TYPE } from './client.type'

export interface CompanyProps {
	id?: UniqueEntityID
	corporateReason: string
	documentType: DOCUMENT_TYPE.CNPJ
	cnpj: string
	email: string
	password: string
	phone: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
