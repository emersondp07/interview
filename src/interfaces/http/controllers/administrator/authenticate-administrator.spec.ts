import { app } from '@/infra/http/server'
import { makeAdministrator } from '@/tests/factories/make-administrator'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Authenticate Administrator (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate administrator', async () => {
		const administrator = makeAdministrator({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		})

		await request(app.server).post('/create-administrator').send({
			name: administrator.name,
			email: administrator.email,
			password: administrator.password,
		})

		const response = await request(app.server)
			.post('/session-administrator')
			.send({
				email: administrator.email,
				password: administrator.password,
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
