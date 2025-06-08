import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import request from 'supertest'

describe('Authenticate Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate interviewer', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const interviewer = makeInterviewer()
		await request(app.server)
			.post('/create-interviewer')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				companyId: companyId,
			})

		const response = await request(app.server)
			.post('/session-interviewer')
			.send({
				email: interviewer.email,
				password: interviewer.password,
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
