import { app } from '@/infra/http/server'
import request from 'supertest'

describe('Authenticate Administrator (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate administrator', async () => {
		await request(app.server).post('/create-administrator').send({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		})

		const response = await request(app.server)
			.post('/session-administrator')
			.send({
				email: 'johndoe@example.com',
				password: '123456',
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
