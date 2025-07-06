import { Plan } from '@/domain/administrator/entities/plan'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import { type Either, success } from '@/domain/core/either'
import type { IStripeProducts } from '@/infra/services/stripe/interfaces/stripe-products'

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
		private stripeProductsService: IStripeProducts,
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
