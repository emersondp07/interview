import { CreateContractUseCase } from '@/application/company/use-cases/create-contract'
import type { CreateContractSchema } from '@/application/company/validators/create-contract.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaContractsRepository } from '@/infra/database/repositories/prisma-contracts-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createContract(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user

	const { title, description, imageUrl } = request.body as CreateContractSchema

	const prismaContractsRepository = new PrismaContractsRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const createContractUseCase = new CreateContractUseCase(
		prismaContractsRepository,
		prismaCompaniesRepository,
	)

	const result = await createContractUseCase.execute({
		title,
		description,
		imageUrl,
		companyId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(201).send()
	})
}
