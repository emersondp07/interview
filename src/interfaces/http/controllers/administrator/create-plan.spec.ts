import { app } from '@/infra/http/server'
import request from 'supertest'

describe('Create Plan (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create plan', async () => {
		const response = await request(app.server).post('/create-plan').send({
			planName: 'Name plan',
			planPrice: '29,90',
			planDescription: 'Description plan',
			planInterviewLimit: 100,
		})

		expect(response.statusCode).toEqual(201)
	})
})
