import { CreateContractUseCase } from '@/domain/company/application/use-cases/create-contract'
import type { CreateContractSchema } from '@/domain/company/application/validators/create-contract.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaContractsRepository } from '@/infra/database/repositories/prisma-contracts-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createContract(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { title, description, imageUrl, companyId } =
		request.body as CreateContractSchema

	const prismaContractsRepository = new PrismaContractsRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const createContractUseCase = new CreateContractUseCase(
		prismaContractsRepository,
		prismaCompaniesRepository,
	)

	await createContractUseCase.execute({
		title,
		description,
		imageUrl,
		companyId,
	})

	return reply.status(201).send()
}
