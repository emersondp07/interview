import { app } from '@/infra/http/server'
import { createAndAuthenticateAdministrator } from '@/tests/factories/create-and-authenticate-administrator'
import { InMemoryStripeProductsService } from '@/tests/repositories/in-memory-stripe-products-service'
import request from 'supertest'

describe('Create Plan (e2e)', () => {
	beforeAll(async () => {
		await app.ready()

		vi.mock('@/infra/services/stripe-products-service', () => {
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

	it('should be able to create plan', async () => {
		const { token } = await createAndAuthenticateAdministrator(app)

		const response = await request(app.server)
			.post('/create-plan')
			.set('Authorization', `Bearer ${token}`)
			.send({
				planName: 'Name plan',
				planPrice: '29,90',
				planDescription: 'Description plan',
				planInterviewLimit: 100,
			})

		expect(response.statusCode).toEqual(201)
	})
})
