import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import request from 'supertest'

describe('Create Contract (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create contract', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const response = await request(app.server).post('/create-contract').send({
			title: 'Contrato 1',
			description: 'Descrição do contrato 1',
			imageUrl: 'https://example.com/contract1.png',
			companyId: companyId,
		})

		// expect(response.status).toEqual(201)
	})
})
