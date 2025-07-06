import { UniqueEntityID } from '../../core/entities/unique-entity'
import { PAYMENT_METHOD } from './interfaces/payment.type'
import { Payment } from './payment'

describe('Payment Entity', () => {
	it('Should be able create a payment with valid data', () => {
		const payment = Payment.create({
			signatureId: new UniqueEntityID(),
			invoiceId: new UniqueEntityID(),
			method: PAYMENT_METHOD.CREDIT_CARD,
			value_paid: '100',
			proof_url: 'http://example.com/proof.jpg',
		})

		expect(payment.id).toBeInstanceOf(UniqueEntityID)
		expect(payment.signatureId).toBeInstanceOf(UniqueEntityID)
		expect(payment.invoiceId).toBeInstanceOf(UniqueEntityID)
		expect(payment.method).toBe(PAYMENT_METHOD.CREDIT_CARD)
		expect(payment.value_paid).toBe('100')
		expect(payment.proof_url).toBe('http://example.com/proof.jpg')
	})
})
