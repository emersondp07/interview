import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryStripeCustomersService } from '@/tests/repositories/in-memory-stripe-customers-service'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Register Company (e2e)', () => {
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

	it('should be able to create company', async () => {
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

		const response = await request(app.server).post('/register-company').send({
			corporateReason: 'Company Name',
			cnpj: '12345678910',
			email: 'company@email.com',
			password: faker.internet.password(),
			phone: '99999999999',
			planId: plan.id.toString(),
		})

		expect(response.statusCode).toEqual(201)
	})
})
