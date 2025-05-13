import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InvoicesRepository } from '@/domain/company/application/repositories/invoices-repository'
import type { Invoice } from '@/domain/company/enterprise/entities/invoice'

export class InMemoryInvoicesRepository implements InvoicesRepository {
	public items: Invoice[] = []

	async findAll({ page }: PaginationParams) {
		const invoices = this.items.slice((page - 1) * 10, page * 10)

		return invoices
	}

	async findById(invoiceId: string) {
		const invoice = this.items.find(
			(invoice) => invoice.id.toString() === invoiceId,
		)

		if (!invoice) {
			return null
		}

		return invoice
	}

	async create(invoice: Invoice) {
		this.items.push(invoice)
	}

	async delete(invoice: Invoice) {
		const itemIndex = this.items.findIndex((item) => item.id === invoice.id)

		this.items.splice(itemIndex, 1)
	}
}
