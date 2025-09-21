import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { RiskLevel } from '@/domain/core/value-objects/risk-score'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CalculateRiskScoreUseCase } from './calculate-risk-score'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: CalculateRiskScoreUseCase

describe('Calculate Risk Score Use Case', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		sut = new CalculateRiskScoreUseCase(inMemoryClientsRepository)
	})

	it('should be able to calculate risk score for a client', async () => {
		const client = makeClient()

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: client.id.toString(),
			vitalSigns: {
				systolicBP: 120,
				diastolicBP: 80,
				heartRate: 70,
				temperature: 36.5,
				respiratoryRate: 16,
				oxygenSaturation: 98,
			},
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
		const client = makeClient()

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			clientId: client.id.toString(),
			vitalSigns: {
				systolicBP: 180,
				diastolicBP: 120,
				heartRate: 130,
				temperature: 39.5,
				respiratoryRate: 25,
				oxygenSaturation: 85,
			},
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

	it('should return error when client does not exist', async () => {
		const result = await sut.execute({
			clientId: 'invalid-id',
			vitalSigns: {
				systolicBP: 120,
				diastolicBP: 80,
				heartRate: 70,
				temperature: 36.5,
				respiratoryRate: 16,
				oxygenSaturation: 98,
			},
			riskFactors: {
				age: 30,
				hasChronicConditions: false,
				smokingStatus: 'never',
				bmi: 22,
				medicationCount: 0,
				symptomSeverity: 2,
			},
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
