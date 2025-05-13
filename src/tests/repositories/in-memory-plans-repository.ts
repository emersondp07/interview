import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { PlansRepository } from '@/domain/administrator/application/repositories/plans-repository'
import type { Plan } from '@/domain/administrator/enterprise/entities/plan'

export class InMemoryPlansRepository implements PlansRepository {
	public items: Plan[] = []

	async findAll({ page }: PaginationParams) {
		const plans = this.items.slice((page - 1) * 10, page * 10)

		return plans
	}

	async findById(planId: string) {
		const plan = this.items.find((plan) => plan.id.toString() === planId)

		if (!plan) {
			return null
		}

		return plan
	}

	async create(plan: Plan) {
		this.items.push(plan)
	}
}
