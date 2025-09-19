import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { RiskScore } from '@/domain/core/value-objects/risk-score'
import type { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

interface CalculateRiskScoreUseCaseRequest {
	triageId: string
	riskFactors: {
		age: number
		hasChronicConditions: boolean
		smokingStatus: 'never' | 'former' | 'current'
		bmi?: number
		medicationCount: number
		symptomSeverity: number
	}
}

type CalculateRiskScoreUseCaseResponse = Either<
	ResourceNotFoundError,
	{ riskScore: RiskScore }
>

export class CalculateRiskScoreUseCase {
	constructor(private readonly triagesRepository: TriagesRepository) {}

	async execute({
		triageId,
		riskFactors,
	}: CalculateRiskScoreUseCaseRequest): Promise<CalculateRiskScoreUseCaseResponse> {
		const triage = await this.triagesRepository.findById(triageId)

		if (!triage) {
			return failed(new ResourceNotFoundError())
		}

		const vitalSigns = triage.vitalSigns as VitalSigns

		if (!vitalSigns) {
			return failed(new ResourceNotFoundError())
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		return success({
			riskScore,
		})
	}
}
