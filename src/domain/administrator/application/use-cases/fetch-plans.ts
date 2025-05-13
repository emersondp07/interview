import { type Either, success } from '@/core/either'
import type { Plan } from '../../enterprise/entities/plan'
import type { PlansRepository } from '../repositories/plans-repository'

interface FetchPlansUseCaseRequest {
	page: number
}

type FetchPlansUseCaseResponse = Either<null, { plans: Plan[] | null }>

export class FetchPlansUseCase {
	constructor(private plansRepository: PlansRepository) {}

	async execute({
		page,
	}: FetchPlansUseCaseRequest): Promise<FetchPlansUseCaseResponse> {
		const plans = await this.plansRepository.findAll({ page })

		return success({ plans })
	}
}
