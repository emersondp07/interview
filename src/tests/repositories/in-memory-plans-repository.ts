import type { Plan } from '@/domain/administrator/entities/plan'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { PrismaPlanMapper } from '@/infra/database/prisma/mappers/prisma-plan-mapper'
import type { Plan as PrismaPlan } from '@prisma/client'

export class InMemoryPlansRepository implements PlansRepository {
	public items: PrismaPlan[] = []

	async findAll({ page }: PaginationParams) {
		const plans = this.items.slice((page - 1) * 10, page * 10)

		return plans.map(PrismaPlanMapper.toDomain)
	}

	async findById(planId: string) {
		const plan = this.items.find((plan) => plan.id.toString() === planId)

		if (!plan) {
			return null
		}

		return plan ? PrismaPlanMapper.toDomain(plan) : null
	}

	async findByProductId(productId: string) {
		const plan = this.items.find((plan) => plan.stripe_product_id === productId)

		if (!plan) {
			return null
		}

		return plan ? PrismaPlanMapper.toDomain(plan) : null
	}

	async create(plan: Plan) {
		const prismaClient = PrismaPlanMapper.toPrisma(plan)

		this.items.push(prismaClient)
	}

	async update(plan: Plan) {
		const prismaClient = PrismaPlanMapper.toPrisma(plan)

		const itemIndex = this.items.findIndex(
			(item) => item.id === prismaClient.id,
		)

		this.items[itemIndex] = prismaClient
	}
}
