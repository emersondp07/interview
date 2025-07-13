import type { ROLE } from '../../../administrator/entities/interfaces/adminitrator.type'
import type { DOCUMENT_TYPE } from '../../../client/entities/interfaces/client.type'
import type { Signature } from '../signature'

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
	signature?: Signature
	stripeCustomerId?: string
}
