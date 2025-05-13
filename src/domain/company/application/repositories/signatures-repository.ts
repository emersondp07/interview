import type { Signature } from '../../../company/enterprise/entities/signature'

export interface SignaturesRepository {
	create(signature: Signature): Promise<void>
	findById(id: string): Promise<Signature | null>
}
