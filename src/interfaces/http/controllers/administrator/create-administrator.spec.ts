import { app } from '@/infra/http/server'
import { makeAdministrator } from '@/tests/factories/make-administrator'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Create Administrator (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create administrator', async () => {
		const administrator = makeAdministrator({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		})

		const response = await request(app.server)
			.post('/create-administrator')
			.send({
				name: administrator.name,
				email: administrator.email,
				password: administrator.password,
			})

		expect(response.statusCode).toEqual(201)
	})
})
