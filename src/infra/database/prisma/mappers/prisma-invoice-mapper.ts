import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { STATUS_PAYMENT } from '@/domain/company/enterprise/entities/interfaces/invoice.type'
import { Invoice } from '@/domain/company/enterprise/entities/invoice'
import type {
	Invoice as PrismaInvoice,
	STATUS_PAYMENT as PrismaStatePayment,
} from '@prisma/client'

export class PrismaInvoiceMapper {
	static toPrisma(invoice: Invoice): PrismaInvoice {
		return {
			id: invoice.id.toString(),
			mounth: invoice.mounth,
			value: invoice.value,
			issueDate: new Date(invoice.issueDate),
			dueDate: new Date(invoice.dueDate),
			paymentDate: invoice.paymentDate ?? null,
			status: invoice.status as PrismaStatePayment,
			signature_id: invoice.signatureId.toString(),
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		}
	}

	static toDomain(raw: PrismaInvoice): Invoice {
		return Invoice.create(
			{
				mounth: raw.mounth,
				value: raw.value,
				status: raw.status as STATUS_PAYMENT,
				signatureId: new UniqueEntityID(raw.signature_id),
			},
			new UniqueEntityID(raw.id),
		)
	}
}
