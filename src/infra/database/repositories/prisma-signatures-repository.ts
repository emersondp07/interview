import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import type { Signature } from '@domain/company/entities/signature'
import { PrismaSignatureMapper } from '../prisma/mappers/prisma-signature-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaSignaturesRepository implements SignaturesRepository {
	update(signature: Signature): Promise<void> {
		throw new Error('Method not implemented.')
	}

	async findById(signatureId: string) {
		const signature = await prisma.signature.findUnique({
			where: {
				id: signatureId,
			},
		})

		return signature ? PrismaSignatureMapper.toDomain(signature) : null
	}

	async create(signature: Signature) {
		const prismaSignature = PrismaSignatureMapper.toPrisma(signature)

		await prisma.signature.create({
			data: prismaSignature,
		})
	}
}
