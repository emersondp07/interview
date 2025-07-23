import type { Invoice } from '../entities/invoice'

export interface InvoicesRepository {
	findAll(
		companyId: string,
		params: { page: number },
	): Promise<Invoice[] | null>
	findById(invoiceId: string): Promise<Invoice | null>
	findBySignatureId(invoiceId: string): Promise<Invoice | null>
	update(invoice: Invoice): Promise<void>
	create(invoice: Invoice): Promise<void>
	delete(invoice: Invoice): Promise<void>
}
