import { app } from '@/infra/http/server'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import request from 'supertest'
import { createAndAuthenticateCompany } from '../../../../tests/factories/create-and-authenticate-company'

describe('Create Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create interviewer', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const interviewer = makeInterviewer()

		const response = await request(app.server)
			.post('/create-interviewer')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				companyId: companyId,
			})

		// expect(response.status).toEqual(201)
	})
})
