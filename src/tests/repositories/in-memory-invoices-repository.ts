import type { Invoice } from '@/domain/company/entities/invoice'
import type { InvoicesRepository } from '@/domain/company/repositories/invoices-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { PrismaInvoiceMapper } from '@/infra/database/prisma/mappers/prisma-invoice-mapper'
import type { Invoice as PrismaInvoice } from '@prisma/client'

export class InMemoryInvoicesRepository implements InvoicesRepository {
	public items: PrismaInvoice[] = []

	async findAll(signatureId: string, { page }: PaginationParams) {
		const invoices = this.items.filter(
			(invoice) => invoice.signature_id === signatureId,
		)

		const invoicesInPage = invoices.slice((page - 1) * 10, page * 10)

		return invoicesInPage.map(PrismaInvoiceMapper.toDomain)
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

	async findBySignatureId(signatureId: string) {
		const invoice = this.items.find(
			(invoice) => invoice.signature_id === signatureId,
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

	async update(invoice: Invoice) {
		const prismaClient = PrismaInvoiceMapper.toPrisma(invoice)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaClient.id,
		)

		this.items[itemIndex] = prismaClient
	}

	async delete(invoice: Invoice) {
		const prismaInvoice = PrismaInvoiceMapper.toPrisma(invoice)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaInvoice.id,
		)

		this.items[itemIndex] = { ...prismaInvoice, deleted_at: new Date() }
	}
}
