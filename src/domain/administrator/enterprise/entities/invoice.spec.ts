import { UniqueEntityID } from '@/core/entities/unique-entity'
import { STATUS_PAYMENT } from './interfaces/invoice.type'
import { Invoice } from './invoice'

describe('Interviewer Entity', () => {
	it('Should be able create a interviewer with valid data', () => {
		const invoice = Invoice.create({
			mounth: 'January',
			value: '100.00',
			status: STATUS_PAYMENT.PAID,
			signatureId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		expect(invoice.id).toBeInstanceOf(UniqueEntityID)
		expect(invoice.signatureId).toBeInstanceOf(UniqueEntityID)
		expect(invoice.planId).toBeInstanceOf(UniqueEntityID)
		expect(invoice.issueDate).toBeInstanceOf(Date)
		expect(invoice.dueDate).toBeInstanceOf(Date)
	})

	it('Should be able to validate the payment status to paid', async () => {
		const invoice = Invoice.create({
			mounth: 'January',
			value: '100.00',
			status: STATUS_PAYMENT.OPEN,
			signatureId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		invoice.addPaymentDate(new Date())

		expect(invoice.paymentDate).toBeInstanceOf(Date)
		expect(invoice.status).toBe(STATUS_PAYMENT.PAID)
	})
})
