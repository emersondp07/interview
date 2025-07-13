import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import {
	type InvoiceProps,
	STATUS_PAYMENT,
} from '@domain/company/entities/interfaces/invoice.type'
import { Invoice } from '@domain/company/entities/invoice'
import { faker } from '@faker-js/faker'

export function makeInvoice(
	override?: Partial<InvoiceProps>,
	id?: UniqueEntityID,
) {
	const invoice = Invoice.create(
		{
			mounth: 'January',
			value: '100.00',
			status: STATUS_PAYMENT.OPEN,
			signatureId: new UniqueEntityID(),
			stripeInvoiceId: faker.string.uuid(),
			...override,
		},
		id,
	)

	return invoice
}
