import type { ROLE } from '../../../../administrator/enterprise/entities/interfaces/adminitrator.type'
import type { DOCUMENT_TYPE } from '../../../../client/enterprise/entities/interfaces/client.type'

export interface CompanyProps {
	corporateReason: string
	documentType: DOCUMENT_TYPE.CNPJ
	cnpj: string
	email: string
	password: string
	phone: string
	role: ROLE.COMPANY
	planId: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	stripeCustomerId?: string
}
