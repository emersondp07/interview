import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../infra/http/server'

describe('Register (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register', async () => {
		const response = await request(app.server).post('/create-plan').send({
			planName: 'John Doe',
			planPrice: 'johndoe@example.com',
			planDescription: '123456',
			planInterviewLimit: 100,
		})

		expect(response.statusCode).toEqual(201)
	})
})
