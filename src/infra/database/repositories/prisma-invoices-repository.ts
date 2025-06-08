import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InvoicesRepository } from '@/domain/company/application/repositories/invoices-repository'
import type { Invoice } from '@/domain/company/enterprise/entities/invoice'
import { PrismaInvoiceMapper } from '../prisma/mappers/prisma-invoice-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaInvoicesRepository implements InvoicesRepository {
	async findAll({ page }: PaginationParams) {
		const invoices = await prisma.invoice.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return invoices.map(PrismaInvoiceMapper.toDomain)
	}

	async findById(invoiceId: string) {
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
		})

		return invoice ? PrismaInvoiceMapper.toDomain(invoice) : null
	}

	async create(invoice: Invoice) {
		const prismaInvoice = PrismaInvoiceMapper.toPrisma(invoice)

		await prisma.invoice.create({
			data: prismaInvoice,
		})
	}

	async delete(invoice: Invoice) {
		const prismaInvoice = PrismaInvoiceMapper.toPrisma(invoice)

		await prisma.invoice.update({
			where: {
				id: prismaInvoice.id,
			},
			data: {
				deleted_at: new Date(),
			},
		})
	}
}
