import { app } from '@/infra/http/server'
import request from 'supertest'

describe('Create Administrator (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create administrator', async () => {
		const response = await request(app.server)
			.post('/create-administrator')
			.send({
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: '123456',
			})

		expect(response.statusCode).toEqual(201)
	})
})
