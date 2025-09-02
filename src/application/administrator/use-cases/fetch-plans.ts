import type { Plan } from '@/domain/administrator/entities/plan'
import type { PlansRepository } from '@/domain/administrator/repositories/plans-repository'
import { type Either, success } from '@/domain/core/either'

interface FetchPlansUseCaseRequest {
	page: number
}

type FetchPlansUseCaseResponse = Either<null, { plans: Plan[] | null }>

export class FetchPlansUseCase {
	constructor(private readonly plansRepository: PlansRepository) {}

	async execute({
		page,
	}: FetchPlansUseCaseRequest): Promise<FetchPlansUseCaseResponse> {
		const plans = await this.plansRepository.findAll({ page })

		return success({ plans })
	}
}
