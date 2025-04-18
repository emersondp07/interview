import { UniqueEntityID } from '@/core/entities/unique-entity'
import { PAYMENT_METHOD } from './interfaces/payment.type'
import { Payment } from './payment'

describe('Interviewer Entity', () => {
	it('Should be able create a interviewer with valid data', () => {
		const payment = Payment.create({
			signatureId: new UniqueEntityID(),
			invoiceId: new UniqueEntityID(),
			method: PAYMENT_METHOD.CREDIT_CARD,
			value_paid: '100',
			proof_url: 'http://example.com/proof.jpg',
		})

		expect(payment.id).toBeInstanceOf(UniqueEntityID)
	})
})
