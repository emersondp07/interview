import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import request from 'supertest'

describe('Register Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register client', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const client = makeClient()

		const response = await request(app.server)
			.post('/register-client')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: client.name,
				email: client.email,
				birthDate: '1990-01-01',
				phone: client.phone,
				documentType: client.documentType,
				document: client.document,
				companyId,
			})

		expect(response.status).toEqual(201)
	})
})
