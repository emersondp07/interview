import type { UniqueEntityID } from '@/core/entities/unique-entity'

export enum DOCUMENT_TYPE {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
	RG = 'RG',
}

export interface ClientProps {
	id?: UniqueEntityID
	name: string
	documentType: DOCUMENT_TYPE.CPF
	document: string
	birthDate: Date
	phone: string
	email: string
	address: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
