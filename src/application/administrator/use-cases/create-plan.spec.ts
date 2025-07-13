import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { InMemoryStripeProductsService } from '@/tests/repositories/in-memory-stripe-products-service'
import { CreatePlanUseCase } from './create-plan'

let inMemoryPlansRepository: InMemoryPlansRepository
let inMemoryStripeProductsService: InMemoryStripeProductsService
let sut: CreatePlanUseCase

describe('Create Plan', () => {
	beforeEach(() => {
		inMemoryPlansRepository = new InMemoryPlansRepository()
		inMemoryStripeProductsService = new InMemoryStripeProductsService()

		sut = new CreatePlanUseCase(
			inMemoryPlansRepository,
			inMemoryStripeProductsService,
		)
	})

	it('Should be able to create a plan', async () => {
		const result = await sut.execute({
			planName: 'Plan 1',
			planPrice: '100',
			planInterviewLimit: 10,
			planDescription: 'Description 1',
		})

		expect(result.isSuccess()).toBe(true)
	})
})
