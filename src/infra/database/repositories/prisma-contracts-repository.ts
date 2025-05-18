import type { Contract } from '@/domain/company/enterprise/entities/contract'
import type { ContractsRepository } from '@/domain/interviewer/application/repositories/contracts-repository'
import { prisma } from '../prisma/prisma'

export class PrismaContractsRepository implements ContractsRepository {
	async create(contract: Contract) {
		await prisma.contract.create({
			data: {
				title: contract.title,
				description: contract.description,
				image_url: contract.imageUrl,
				company_id: contract.companyId.toString(),
			},
		})
	}
}
