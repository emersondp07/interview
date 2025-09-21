import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { RiskScore } from '@/domain/core/value-objects/risk-score'
import { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'

interface CalculateRiskScoreUseCaseRequest {
	clientId: string
	vitalSigns: {
		systolicBP: number
		diastolicBP: number
		heartRate: number
		temperature: number
		respiratoryRate: number
		oxygenSaturation: number
	}
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
	constructor(private readonly clientsRepository: ClientsRepository) {}

	async execute({
		clientId,
		vitalSigns,
		riskFactors,
	}: CalculateRiskScoreUseCaseRequest): Promise<CalculateRiskScoreUseCaseResponse> {
		const client = await this.clientsRepository.findById(clientId)

		if (!client) {
			return failed(new ResourceNotFoundError())
		}

		const vitalSignsVO = VitalSigns.create({
			systolicBP: vitalSigns.systolicBP,
			diastolicBP: vitalSigns.diastolicBP,
			heartRate: vitalSigns.heartRate,
			temperature: vitalSigns.temperature,
			respiratoryRate: vitalSigns.respiratoryRate,
			oxygenSaturation: vitalSigns.oxygenSaturation,
		})

		const riskScore = RiskScore.calculate(vitalSignsVO, riskFactors)

		return success({
			riskScore,
		})
	}
}
