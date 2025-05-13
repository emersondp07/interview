import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { CreatePlanUseCase } from './create-plan'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: CreatePlanUseCase

describe('Create Plan', () => {
	beforeEach(() => {
		inMemoryPlansRepository = new InMemoryPlansRepository()

		sut = new CreatePlanUseCase(inMemoryPlansRepository)
	})

	it('Should be able to create a plan', async () => {
		const result = await sut.execute({
			planName: 'Plan 1',
			planPrice: '100',
			planInterviewLimit: 10,
			planDescription: 'Description 1',
		})

		expect(result.isSuccess()).toBe(true)
		expect(inMemoryPlansRepository.items[0]).toEqual(result.value?.plan)
	})
})
