import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { RiskLevel } from '@/domain/core/value-objects/risk-score'
import { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import { makeTriage } from '@/tests/factories/make-triage'
import { InMemoryTriagesRepository } from '@/tests/repositories/in-memory-triages-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CalculateRiskScoreUseCase } from './calculate-risk-score'

let inMemoryTriagesRepository: InMemoryTriagesRepository
let sut: CalculateRiskScoreUseCase

describe('Calculate Risk Score Use Case', () => {
	beforeEach(() => {
		inMemoryTriagesRepository = new InMemoryTriagesRepository()
		sut = new CalculateRiskScoreUseCase(inMemoryTriagesRepository)
	})

	it('should be able to calculate risk score for a triage', async () => {
		const normalVitalSigns = VitalSigns.create({
			systolicBP: 120,
			diastolicBP: 80,
			heartRate: 70,
			temperature: 36.5,
			respiratoryRate: 16,
			oxygenSaturation: 98,
		})

		const triage = makeTriage({
			vitalSigns: normalVitalSigns,
		})

		await inMemoryTriagesRepository.create(triage)

		const result = await sut.execute({
			triageId: triage.id.toString(),
			riskFactors: {
				age: 30,
				hasChronicConditions: false,
				smokingStatus: 'never',
				bmi: 22,
				medicationCount: 0,
				symptomSeverity: 2,
			},
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			riskScore: expect.objectContaining({
				level: RiskLevel.LOW,
				score: expect.any(Number),
			}),
		})
	})

	it('should calculate high risk score for abnormal vitals and risk factors', async () => {
		const abnormalVitalSigns = VitalSigns.create({
			systolicBP: 180,
			diastolicBP: 120,
			heartRate: 130,
			temperature: 39.5,
			respiratoryRate: 25,
			oxygenSaturation: 85,
		})

		const triage = makeTriage({
			vitalSigns: abnormalVitalSigns,
		})

		await inMemoryTriagesRepository.create(triage)

		const result = await sut.execute({
			triageId: triage.id.toString(),
			riskFactors: {
				age: 80,
				hasChronicConditions: true,
				smokingStatus: 'current',
				bmi: 35,
				medicationCount: 6,
				symptomSeverity: 9,
			},
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			riskScore: expect.objectContaining({
				level: RiskLevel.CRITICAL,
				priority: 1,
			}),
		})
	})

	it('should return error when triage does not exist', async () => {
		const result = await sut.execute({
			triageId: 'invalid-id',
			riskFactors: {
				age: 30,
				hasChronicConditions: false,
				smokingStatus: 'never',
				medicationCount: 0,
				symptomSeverity: 2,
			},
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
