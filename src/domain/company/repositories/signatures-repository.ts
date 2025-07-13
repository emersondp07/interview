import type { Signature } from '../entities/signature'

export interface SignaturesRepository {
	create(signature: Signature): Promise<void>
	findById(id: string): Promise<Signature | null>
	update(signature: Signature): Promise<void>
}
