import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeTriage } from '@/tests/factories/make-triage'
import { InMemoryTriagesRepository } from '@/tests/repositories/in-memory-triages-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateTriageUseCase } from './update-triage'

let inMemoryTriagesRepository: InMemoryTriagesRepository
let sut: UpdateTriageUseCase

describe('Update Triage Use Case', () => {
	beforeEach(() => {
		inMemoryTriagesRepository = new InMemoryTriagesRepository()
		sut = new UpdateTriageUseCase(inMemoryTriagesRepository)
	})

	it('should be able to update a triage', async () => {
		const triage = makeTriage({
			nurseName: 'Old Nurse',
			notes: 'Old notes',
		})

		await inMemoryTriagesRepository.create(triage)

		const result = await sut.execute({
			triageId: triage.id.toString(),
			nurseName: 'New Nurse',
			notes: 'Updated notes',
			vitalSigns: {
				systolicBP: 130,
				diastolicBP: 85,
				heartRate: 75,
				temperature: 37.0,
				respiratoryRate: 18,
				oxygenSaturation: 97,
			},
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triage: expect.objectContaining({
				nurseName: 'New Nurse',
				notes: 'Updated notes',
			}),
		})
	})

	it('should be able to update only nurse name', async () => {
		const triage = makeTriage({
			nurseName: 'Old Nurse',
		})

		await inMemoryTriagesRepository.create(triage)

		const result = await sut.execute({
			triageId: triage.id.toString(),
			nurseName: 'New Nurse Only',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			triage: expect.objectContaining({
				nurseName: 'New Nurse Only',
			}),
		})
	})

	it('should return error when triage does not exist', async () => {
		const result = await sut.execute({
			triageId: 'invalid-id',
			nurseName: 'New Nurse',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
