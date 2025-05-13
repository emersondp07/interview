import { type Either, success } from '@/core/either'
import { Plan } from '../../enterprise/entities/plan'
import type { PlansRepository } from '../repositories/plans-repository'

interface CreatePlanUseCaseRequest {
	planName: string
	planPrice: string
	planInterviewLimit: number
	planDescription: string
}

type CreatePlanUseCaseResponse = Either<null, { plan: Plan }>

export class CreatePlanUseCase {
	constructor(private plansRepository: PlansRepository) {}

	async execute({
		planName,
		planPrice,
		planInterviewLimit,
		planDescription,
	}: CreatePlanUseCaseRequest): Promise<CreatePlanUseCaseResponse> {
		const plan = Plan.create({
			name: planName,
			price: planPrice,
			interviewLimit: planInterviewLimit,
			description: planDescription,
		})

		await this.plansRepository.create(plan)

		return success({ plan })
	}
}
