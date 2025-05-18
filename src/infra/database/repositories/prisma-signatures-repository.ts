import type { SignaturesRepository } from '@/domain/company/application/repositories/signatures-repository'
import type { Signature } from '@/domain/company/enterprise/entities/signature'
import { prisma } from '../prisma/prisma'

export class PrismaSignaturesRepository implements SignaturesRepository {
	async create(signature: Signature) {
		await prisma.signature.create({
			data: {
				start_validity: signature.startValidity,
				status: signature.status,
				company_id: signature.companyId.toString(),
				plan_id: signature.planId.toString(),
			},
		})
	}

	async findById(signatureId: string) {
		return prisma.signature.findUnique({
			where: {
				id: signatureId,
			},
			select: {
				id: true,
				start_validity: true,
				end_validity: true,
				status: true,
			},
		}) as unknown as Signature
	}
}
