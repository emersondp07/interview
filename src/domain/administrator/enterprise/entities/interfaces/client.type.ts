import type { ROLE } from './adminitrator.type'

export enum DOCUMENT_TYPE {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
	RG = 'RG',
}

export interface ClientProps {
	name: string
	documentType: DOCUMENT_TYPE.CPF
	document: string
	birthDate: Date
	phone: string
	email: string
	role: ROLE.CLIENT
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
