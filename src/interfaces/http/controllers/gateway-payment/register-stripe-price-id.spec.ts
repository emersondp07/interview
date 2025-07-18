import { env } from '@/infra/config'
import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makePlan } from '@/tests/factories/make-plan'
import { makeStripePriceCreatedEvent } from '@/tests/factories/make-stripe-price-created-event'
import { InMemoryStripeProductsService } from '@/tests/repositories/in-memory-stripe-products-service'
import { faker } from '@faker-js/faker'
import Stripe from 'stripe'
import request from 'supertest'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-05-28.basil',
})

describe('Stripe Webhook - price.created (e2e)', () => {
	beforeAll(async () => {
		await app.ready()

		vi.mock('@/infra/services/stripe/products', () => {
			return {
				StripeProductsService: vi
					.fn()
					.mockImplementation(() => new InMemoryStripeProductsService()),
			}
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should handle stripe price.created event', async () => {
		const plan = makePlan({
			stripeProductId: `prod_${faker.string.alphanumeric(14)}`,
		})

		await prisma.plan.create({
			data: {
				id: plan.id.toString(),
				name: 'Name plan',
				price: '29,90',
				description: 'Description plan',
				interview_limit: 100,
				stripe_product_id: plan.stripeProductId,
			},
		})
		const event = makeStripePriceCreatedEvent({
			productId: plan.stripeProductId,
		})

		const signature = stripe.webhooks.generateTestHeaderString({
			payload: JSON.stringify(event),
			secret: env.STRIPE_WEBHOOK_SECRET_KEY,
		})

		const response = await request(app.server)
			.post('/webhook')
			.set('stripe-signature', signature)
			.send(event)

		expect(response.statusCode).toBe(200)
	})
})
