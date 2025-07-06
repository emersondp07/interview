import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Create Invoice (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create invoice', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const response = await request(app.server)
			.post('/create-invoice')
			.set('Authorization', `Bearer ${token}`)
			.send({
				mounth: 'JAN',
				value: '29,90',
				status: 'OPEN',
				signatureId,
				stripeInvoiceId: faker.string.uuid(),
			})

		expect(response.status).toEqual(201)
	})
})
