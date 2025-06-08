import { app } from '@/infra/http/server'
import request from 'supertest'
import { DOCUMENT_TYPE } from '../../../../domain/client/enterprise/entities/interfaces/client.type'
import { createAndAuthenticateCompany } from '../../../../tests/factories/create-and-authenticate-company'

describe('Authenticate Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate client', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		await request(app.server)
			.post('/register-client')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'John Doe',
				documentType: DOCUMENT_TYPE.CPF,
				document: '12345678911',
				birthDate: '10-09-1996',
				phone: '11 987466531',
				email: 'johndoe@email.com',
				companyId: companyId,
			})

		const response = await request(app.server).post('/session-client').send({
			document: '12345678911',
		})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
