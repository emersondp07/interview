import type { Plan } from '@/domain/administrator/entities/plan'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import { type Either, success } from '@/domain/core/either'

interface RegisterStripePriceIdUseCaseRequest {
	productId: string
	priceId: string
}

type RegisterStripePriceIdUseCaseResponse = Either<null, { plan: Plan }>

export class RegisterStripePriceIdUseCase {
	constructor(private readonly plansRepository: PlansRepository) {}

	async execute({
		productId,
		priceId,
	}: RegisterStripePriceIdUseCaseRequest): Promise<RegisterStripePriceIdUseCaseResponse> {
		const plan = await this.plansRepository.findByProductId(productId)

		if (!plan) {
			throw new Error('Plan not found')
		}

		plan.addPriceId(priceId)

		await this.plansRepository.update(plan)

		return success({ plan })
	}
}
