import { CreatePlanUseCase } from '@/domain/administrator/application/use-cases/create-plan'
import type { CreatePlanSchema } from '@/domain/administrator/application/validators/create-plan.schema'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createPlan(request: FastifyRequest, reply: FastifyReply) {
	const { planName, planPrice, planInterviewLimit, planDescription } =
		request.body as CreatePlanSchema

	const prismaPlansRepository = new PrismaPlansRepository()
	const createPlanUseCase = new CreatePlanUseCase(prismaPlansRepository)

	await createPlanUseCase.execute({
		planName,
		planPrice,
		planInterviewLimit,
		planDescription,
	})

	return reply.status(201).send()
}
