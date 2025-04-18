import type { ROLE } from './adminitrator.type'
import type { DOCUMENT_TYPE } from './client.type'

export interface CompanyProps {
	corporateReason: string
	documentType: DOCUMENT_TYPE.CNPJ
	cnpj: string
	email: string
	password: string
	phone: string
	role: ROLE.COMPANY
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
