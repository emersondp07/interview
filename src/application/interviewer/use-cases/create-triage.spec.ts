import { InMemoryTriagesRepository } from '@/tests/repositories/in-memory-triages-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTriageUseCase } from './create-triage'

let inMemoryTriagesRepository: InMemoryTriagesRepository
let sut: CreateTriageUseCase

describe('Create Triage Use Case', () => {
	beforeEach(() => {
		inMemoryTriagesRepository = new InMemoryTriagesRepository()
		sut = new CreateTriageUseCase(inMemoryTriagesRepository)
	})

	it('should be able to create a triage', async () => {
		const result = await sut.execute({
			clientId: 'client-1',
			nurseName: 'Enfermeira Ana',
			notes: 'Paciente apresenta sinais vitais normais',
			vitalSigns: {
				systolicBP: 120,
				diastolicBP: 80,
				heartRate: 70,
				temperature: 36.5,
				respiratoryRate: 16,
				oxygenSaturation: 98,
				weight: 70,
				height: 170,
			},
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triage: expect.objectContaining({
				nurseName: 'Enfermeira Ana',
				notes: 'Paciente apresenta sinais vitais normais',
			}),
		})
		expect(inMemoryTriagesRepository.items).toHaveLength(1)
	})

	it('should be able to create a triage without optional fields', async () => {
		const result = await sut.execute({
			clientId: 'client-1',
			nurseName: 'Enfermeira Maria',
			vitalSigns: {
				systolicBP: 110,
				diastolicBP: 70,
				heartRate: 65,
				temperature: 36.2,
				respiratoryRate: 15,
				oxygenSaturation: 99,
			},
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triage: expect.objectContaining({
				nurseName: 'Enfermeira Maria',
				notes: undefined,
			}),
		})
	})
})
