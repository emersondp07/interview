import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import type { Signature } from '@domain/company/entities/signature'

export class InMemorySignaturesRepository implements SignaturesRepository {
	update(signature: Signature): Promise<void> {
		throw new Error('Method not implemented.')
	}
	public items: Signature[] = []

	async findById(signatureId: string) {
		const signature = this.items.find(
			(signature) => signature.id.toString() === signatureId,
		)

		if (!signature) {
			return null
		}

		return signature
	}

	async create(signature: Signature) {
		this.items.push(signature)
	}
}
