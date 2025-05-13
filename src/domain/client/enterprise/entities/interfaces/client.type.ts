import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { ROLE } from '../../../../administrator/enterprise/entities/interfaces/adminitrator.type'

export enum DOCUMENT_TYPE {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
	RG = 'RG',
}

export interface ClientProps {
	name: string
	documentType: DOCUMENT_TYPE
	document: string
	birthDate: Date
	phone: string
	email: string
	role: ROLE.CLIENT
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	companyId: UniqueEntityID
}
