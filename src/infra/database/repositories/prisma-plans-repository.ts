import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { Plan } from '@domain/administrator/entities/plan'
import type { PlansRepository } from '@domain/administrator/repositories/plans-repository'
import { PrismaPlanMapper } from '../prisma/mappers/prisma-plan-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaPlansRepository implements PlansRepository {
	async findAll({ page }: PaginationParams) {
		const plans = await prisma.plan.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return plans.map(PrismaPlanMapper.toDomain)
	}

	async findById(planId: string) {
		const plan = await prisma.plan.findUnique({
			where: {
				id: planId,
			},
		})

		return plan ? PrismaPlanMapper.toDomain(plan) : null
	}

	async create(plan: Plan) {
		const prismaPlan = PrismaPlanMapper.toPrisma(plan)

		await prisma.plan.create({
			data: prismaPlan,
		})
	}
}
