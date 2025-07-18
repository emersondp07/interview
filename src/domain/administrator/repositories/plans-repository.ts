import type { Plan } from '../entities/plan'

export interface PlansRepository {
	findAll(params: { page: number }): Promise<Plan[] | null>
	findById(planId: string): Promise<Plan | null>
	findByProductId(productId: string): Promise<Plan | null>
	create(plan: Plan): Promise<void>
	update(plan: Plan): Promise<void>
}
