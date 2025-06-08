import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InvoicesRepository } from '@/domain/company/application/repositories/invoices-repository'
import type { Invoice as PrismaInvoice } from '@prisma/client'
import type { Invoice } from '../../domain/company/enterprise/entities/invoice'
import { PrismaInvoiceMapper } from '../../infra/database/prisma/mappers/prisma-invoice-mapper'

export class InMemoryInvoicesRepository implements InvoicesRepository {
	public items: PrismaInvoice[] = []

	async findAll({ page }: PaginationParams) {
		const invoices = this.items.slice((page - 1) * 10, page * 10)

		return invoices.map(PrismaInvoiceMapper.toDomain)
	}

	async findById(invoiceId: string) {
		const invoice = this.items.find(
			(invoice) => invoice.id.toString() === invoiceId,
		)

		if (!invoice) {
			return null
		}

		return invoice ? PrismaInvoiceMapper.toDomain(invoice) : null
	}

	async create(invoice: Invoice) {
		const prismaInvoice = PrismaInvoiceMapper.toPrisma(invoice)

		this.items.push(prismaInvoice)
	}

	async delete(invoice: Invoice) {
		const prismaInvoice = PrismaInvoiceMapper.toPrisma(invoice)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaInvoice.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
