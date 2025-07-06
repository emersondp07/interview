import { FetchPlansUseCase } from '@/application/administrator/use-cases/fetch-plans'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import type { FetchPlansSchema } from '@application/administrator/validators/fetch-plans.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchPlans(request: FastifyRequest, reply: FastifyReply) {
	const { page } = request.query as FetchPlansSchema

	const prismaPlansRepository = new PrismaPlansRepository()
	const fetchPlansUseCase = new FetchPlansUseCase(prismaPlansRepository)

	const { value } = await fetchPlansUseCase.execute({ page })

	return reply.status(200).send(value)
}
