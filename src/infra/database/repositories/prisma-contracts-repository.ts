import type { ContractsRepository } from '@/domain/interviewer/repositories/contracts-repository'
import type { Contract } from '@domain/company/entities/contract'
import { PrismaContractMapper } from '../prisma/mappers/prisma-contract-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaContractsRepository implements ContractsRepository {
	async create(contract: Contract) {
		const prismaContract = PrismaContractMapper.toPrisma(contract)

		await prisma.contract.create({
			data: prismaContract,
		})
	}
}
