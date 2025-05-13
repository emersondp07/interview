import type { Invoice } from '../../enterprise/entities/invoice'

export interface InvoicesRepository {
	findAll(params: { page: number }): Promise<Invoice[] | null>
	findById(invoiceId: string): Promise<Invoice | null>
	create(invoice: Invoice): Promise<void>
	delete(invoice: Invoice): Promise<void>
}
