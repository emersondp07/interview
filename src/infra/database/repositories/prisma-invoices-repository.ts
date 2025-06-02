import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InvoicesRepository } from '@/domain/company/application/repositories/invoices-repository'
import type { Invoice } from '@/domain/company/enterprise/entities/invoice'
import { prisma } from '../prisma/prisma'

export class PrismaInvoicesRepository implements InvoicesRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.interview.findMany({
			select: {
				id: true,
				status: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Invoice[]
	}

	async findById(invoiceId: string) {
		return prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
			select: {
				id: true,
				mounth: true,
				value: true,
				issueDate: true,
				dueDate: true,
				paymentDate: true,
				status: true,
			},
		}) as unknown as Invoice
	}

	async create(invoice: Invoice) {
		await prisma.invoice.create({
			data: {
				mounth: invoice.mounth,
				value: invoice.value,
				issueDate: invoice.issueDate,
				dueDate: invoice.dueDate,
				paymentDate: invoice.paymentDate,
				status: invoice.status,
			},
		})
	}

	async delete(invoice: Invoice) {
		await prisma.invoice.delete({
			where: {
				id: invoice.id.toString(),
			},
		})
	}
}
