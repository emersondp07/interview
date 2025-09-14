import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterStripePriceIdUseCase } from './register-stripe-price-id'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: RegisterStripePriceIdUseCase

describe('Register Stripe Price Id', () => {
	beforeEach(() => {
		inMemoryPlansRepository = new InMemoryPlansRepository()

		sut = new RegisterStripePriceIdUseCase(inMemoryPlansRepository)
	})

	it('Should be able to register stripe price id in a plan', async () => {
		const stripeProductId = faker.string.uuid()
		const stripePriceId = faker.string.uuid()

		const plan = makePlan({
			stripeProductId,
		})

		inMemoryPlansRepository.create(plan)

		const result = await sut.execute({
			productId: stripeProductId,
			priceId: stripePriceId,
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.plan.stripePriceId).toBe(stripePriceId)
		}
		expect(inMemoryPlansRepository.items[0].stripe_price_id).toBe(stripePriceId)
	})

	it('Should throw an error if plan does not exist', async () => {
		const stripeProductId = faker.string.uuid()
		const stripePriceId = faker.string.uuid()

		await expect(
			sut.execute({
				productId: stripeProductId,
				priceId: stripePriceId,
			}),
		).rejects.toThrow('Plan not found')
	})
})
