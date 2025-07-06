import { WatchedList } from '../../core/entities/watched-list'
import type { Invoice } from './invoice'

export class InvoicesList extends WatchedList<Invoice> {
	compareItems(a: Invoice, b: Invoice): boolean {
		return a.id.equals(b.id)
	}
}
