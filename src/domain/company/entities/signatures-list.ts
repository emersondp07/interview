import { WatchedList } from '../../core/entities/watched-list'
import type { Signature } from './signature'

export class SignaturesList extends WatchedList<Signature> {
	compareItems(a: Signature, b: Signature): boolean {
		return a.id.equals(b.id)
	}
}
