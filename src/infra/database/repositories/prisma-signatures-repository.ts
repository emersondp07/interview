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
		await prisma.signature.create({
			data: {
				id: signature.id.toString(),
				start_validity: signature.startValidity,
				status: signature.status,
				company_id: signature.companyId.toString(),
				plan_id: signature.planId.toString(),
			},
		})
	}
}
