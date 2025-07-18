import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryStripeCustomersService } from '@/tests/repositories/in-memory-stripe-customers-service'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Authenticate Company (e2e)', () => {
	beforeAll(async () => {
		await app.ready()

		vi.mock('@/infra/services/stripe/customers', () => {
			return {
				StripeCustomersService: vi
					.fn()
					.mockImplementation(() => new InMemoryStripeCustomersService()),
			}
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate company', async () => {
		const plan = makePlan()
		await prisma.plan.create({
			data: {
				id: plan.id.toString(),
				name: plan.name,
				price: plan.price,
				description: plan.description,
				interview_limit: plan.interviewLimit,
				stripe_product_id: plan.stripeProductId,
				stripe_price_id: plan.stripePriceId,
			},
		})

		const company = makeCompany()

		await request(app.server).post('/register-company').send({
			corporateReason: company.corporateReason,
			cnpj: company.cnpj,
			email: company.email,
			password: company.password,
			phone: company.phone,
			planId: plan.id.toString(),
		})

		const response = await request(app.server).post('/session-company').send({
			email: company.email,
			password: company.password,
		})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})

	it('should be able not to authenticate company if email or password was wrong', async () => {
		const response = await request(app.server).post('/session-company').send({
			email: faker.internet.email(),
			password: faker.internet.password(),
		})

		expect(response.statusCode).toEqual(401)
	})
})
