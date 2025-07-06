import type { ContractsRepository } from '@/domain/interviewer/repositories/contracts-repository'
import { PrismaContractMapper } from '@/infra/database/prisma/mappers/prisma-contract-mapper'
import type { Contract } from '@domain/company/entities/contract'
import type { Contract as PrismaContract } from '@prisma/client'

export class InMemoryContractsRepository implements ContractsRepository {
	public items: PrismaContract[] = []

	async create(contract: Contract) {
		const prismaContract = PrismaContractMapper.toPrisma(contract)

		this.items.push(prismaContract)
	}
}
