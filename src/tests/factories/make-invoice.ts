import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
	type InvoiceProps,
	STATUS_PAYMENT,
} from '@/domain/company/enterprise/entities/interfaces/invoice.type'
import { Invoice } from '@/domain/company/enterprise/entities/invoice'

export function makeInvoice(
	override: Partial<InvoiceProps> = {},
	id?: UniqueEntityID,
) {
	const invoice = Invoice.create(
		{
			mounth: 'January',
			value: '100.00',
			status: STATUS_PAYMENT.OPEN,
			signatureId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return invoice
}
