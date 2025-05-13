import type { Plan } from '../../enterprise/entities/plan'

export interface PlansRepository {
	findAll(params: { page: number }): Promise<Plan[] | null>
	findById(planId: string): Promise<Plan | null>
	create(plan: Plan): Promise<void>
}
