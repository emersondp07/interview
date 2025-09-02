import { FetchPlansUseCase } from '@/application/administrator/use-cases/fetch-plans'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FetchPlansSchema } from '@application/administrator/validators/fetch-plans.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchPlans(request: FastifyRequest, reply: FastifyReply) {
	const { page } = request.query as FetchPlansSchema

	const prismaPlansRepository = new PrismaPlansRepository()
	const fetchPlansUseCase = new FetchPlansUseCase(prismaPlansRepository)

	const result = await fetchPlansUseCase.execute({ page })

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}
