import type { GetClientSchema } from '@/application/client/validators/get-client.schema'
import { GetClientByIdUseCase } from '@/application/company/use-cases/get-client-by-id'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getClient(request: FastifyRequest, reply: FastifyReply) {
	// const { sub: companyId } = request.user

	const { clientId } = request.params as GetClientSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const fetchInterviewersUseCase = new GetClientByIdUseCase(
		prismaClientsRepository,
		prismaCompaniesRepository,
	)

	const { value } = await fetchInterviewersUseCase.execute({
		clientId,
	})

	return reply.status(200).send(value)
}
