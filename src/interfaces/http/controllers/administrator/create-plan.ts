import { CreatePlanUseCase } from '@/application/administrator/use-cases/create-plan'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import { StripeProductsService } from '@/infra/services/stripe/products'
import type { CreatePlanSchema } from '@application/administrator/validators/create-plan.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createPlan(request: FastifyRequest, reply: FastifyReply) {
	const { planName, planPrice, planInterviewLimit, planDescription } =
		request.body as CreatePlanSchema

	const prismaPlansRepository = new PrismaPlansRepository()
	const stripeProductsService = new StripeProductsService()
	const createPlanUseCase = new CreatePlanUseCase(
		prismaPlansRepository,
		stripeProductsService,
	)

	await createPlanUseCase.execute({
		planName,
		planPrice,
		planDescription,
		planInterviewLimit,
	})

	return reply.status(201).send()
}
