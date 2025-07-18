import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import type { Signature } from '@domain/company/entities/signature'
import type { Signature as PrismaSignature } from '@prisma/client'
import { PrismaSignatureMapper } from '../../infra/database/prisma/mappers/prisma-signature-mapper'

export class InMemorySignaturesRepository implements SignaturesRepository {
	public items: PrismaSignature[] = []

	async findById(signatureId: string) {
		const signature = this.items.find(
			(signature) => signature.id.toString() === signatureId,
		)

		if (!signature) {
			return null
		}

		return signature ? PrismaSignatureMapper.toDomain(signature) : null
	}

	async create(signature: Signature) {
		const prismaClient = PrismaSignatureMapper.toPrisma(signature)

		this.items.push(prismaClient)
	}

	async update(signature: Signature) {
		const prismaClient = PrismaSignatureMapper.toPrisma(signature)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaClient.id,
		)

		this.items[itemIndex] = prismaClient
	}
}
