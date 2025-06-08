import type { Contract } from '@/domain/company/enterprise/entities/contract'
import type { ContractsRepository } from '@/domain/interviewer/application/repositories/contracts-repository'
import { PrismaContractMapper } from '@/infra/database/prisma/mappers/prisma-contract-mapper'
import type { Contract as PrismaContract } from '@prisma/client'

export class InMemoryContractsRepository implements ContractsRepository {
	public items: PrismaContract[] = []

	async create(contract: Contract) {
		const prismaContract = PrismaContractMapper.toPrisma(contract)

		this.items.push(prismaContract)
	}
}
