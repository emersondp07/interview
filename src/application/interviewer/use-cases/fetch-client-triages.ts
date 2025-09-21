import { type Either, success } from '@/domain/core/either'
import type { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

interface FetchClientTriagesUseCaseRequest {
	clientId: string
}

type FetchClientTriagesUseCaseResponse = Either<null, { triages: Triage[] }>

export class FetchClientTriagesUseCase {
	constructor(private readonly triagesRepository: TriagesRepository) {}

	async execute({
		clientId,
	}: FetchClientTriagesUseCaseRequest): Promise<FetchClientTriagesUseCaseResponse> {
		const triages = await this.triagesRepository.findByClientId(clientId, {
			page: 1,
		})

		return success({
			triages: triages || [],
		})
	}
}
