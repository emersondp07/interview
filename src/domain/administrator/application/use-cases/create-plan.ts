import { type Either, success } from '@/core/either'
import type { StripeProductsService } from '@/infra/services/stripe/products'
import { Plan } from '../../enterprise/entities/plan'
import type { PlansRepository } from '../repositories/plans-repository'

interface CreatePlanUseCaseRequest {
	planName: string
	planPrice: string
	planDescription: string
	planInterviewLimit: number
}

type CreatePlanUseCaseResponse = Either<null, { plan: Plan }>

export class CreatePlanUseCase {
	constructor(
		private plansRepository: PlansRepository,
		private stripeProductsService: StripeProductsService,
	) {}

	async execute({
		planName,
		planPrice,
		planDescription,
		planInterviewLimit,
	}: CreatePlanUseCaseRequest): Promise<CreatePlanUseCaseResponse> {
		const stripeProduct = await this.stripeProductsService.createProduct(
			planName,
			planPrice,
			planDescription,
		)

		const plan = Plan.create({
			name: planName,
			price: planPrice,
			interviewLimit: planInterviewLimit,
			description: planDescription,
			stripeProductId: stripeProduct.id,
		})

		await this.plansRepository.create(plan)

		return success({ plan })
	}
}
