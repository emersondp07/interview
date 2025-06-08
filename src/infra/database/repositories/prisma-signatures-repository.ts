import type { SignaturesRepository } from '@/domain/company/application/repositories/signatures-repository'
import type { Signature } from '@/domain/company/enterprise/entities/signature'
import { PrismaSignatureMapper } from '../prisma/mappers/prisma-signature-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaSignaturesRepository implements SignaturesRepository {
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
