import { env } from '@/infra/config'
import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import { makeSignature } from '@/tests/factories/make-signature'
import { makeStripeCheckoutSessionCompletedEvent } from '@/tests/factories/make-stripe-checkout-session-event'
import { InMemoryResendEmailsService } from '@/tests/repositories/in-memory-resend-emails-service'
import { faker } from '@faker-js/faker'
import Stripe from 'stripe'
import request from 'supertest'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-05-28.basil',
})

describe('Stripe Webhook - checkout.session.completed (e2e)', () => {
	beforeAll(async () => {
		await app.ready()

		vi.mock('@/infra/services/email/emails', () => {
			return {
				ResendEmailsService: vi
					.fn()
					.mockImplementation(() => new InMemoryResendEmailsService()),
			}
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should handle stripe checkout.session.completed event', async () => {
		const plan = makePlan()

		await prisma.plan.create({
			data: {
				id: plan.id.toString(),
				name: 'Name plan',
				price: '29,90',
				description: 'Description plan',
				interview_limit: 100,
				stripe_product_id: faker.string.uuid(),
				stripe_price_id: faker.string.uuid(),
			},
		})

		const mCompany = makeCompany({
			stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
			planId: plan.id.toString(),
		})

		const mSignature = makeSignature({
			stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
			stripeSubscriptionStatus: 'completed',
			planId: plan.id,
		})

		await prisma.company.create({
			data: {
				id: mCompany.id.toString(),
				corporate_reason: mCompany.corporateReason,
				cnpj: mCompany.cnpj,
				email: mCompany.email,
				password: mCompany.password,
				phone: mCompany.phone,
				role: mCompany.role,
				plan_id: mCompany.planId,
				stripe_customer_id: mCompany.stripeCustomerId,
				signature: {
					create: {
						id: mSignature.id.toString(),
						start_validity: mSignature.startValidity,
						end_validity: mSignature.endValidity,
						status: mSignature.status,
						plan_id: mSignature.planId.toString(),
					},
				},
			},
		})

		const event = makeStripeCheckoutSessionCompletedEvent({
			customerId: mCompany.stripeCustomerId,
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
