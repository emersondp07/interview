import type { UniqueEntityID } from '@/core/entities/unique-entity'

export enum PAYMENT_METHOD {
	PIX = 'PIX',
	CREDIT_CARD = 'CREDIT_CARD',
	DEBIT_CARD = 'DEBIT_CARD',
	BOLETO = 'BOLETO',
}

export interface PaymentProps {
	signatureId: UniqueEntityID
	invoiceId: UniqueEntityID
	method: PAYMENT_METHOD
	value_paid: string
	proof_url: string
	createdAt: Date
	updatedAt: Date
}
