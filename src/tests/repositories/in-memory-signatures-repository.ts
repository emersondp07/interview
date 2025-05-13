import type { SignaturesRepository } from '@/domain/company/application/repositories/signatures-repository'
import type { Signature } from '@/domain/company/enterprise/entities/signature'

export class InMemorySignaturesRepository implements SignaturesRepository {
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
