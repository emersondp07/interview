import { FetchClientsUseCase } from '@/application/company/use-cases/fetch-clients'
import type { FetchClientsSchema } from '@/application/company/validators/fetch-clients.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchClients(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user

	const { page } = request.query as FetchClientsSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const fetchInterviewersUseCase = new FetchClientsUseCase(
		prismaClientsRepository,
	)

	const { value } = await fetchInterviewersUseCase.execute({ companyId, page })

	return reply.status(200).send(value)
}
