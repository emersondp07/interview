import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import request from 'supertest'

describe('Delete Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete interviewer', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const interviewer = makeInterviewer()

		await prisma.interviewer.create({
			data: {
				id: interviewer.id.toString(),
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				specialty: interviewer.specialty,
				number_registration: interviewer.numberRegistration,
				profissional_registration: interviewer.profissionalRegistration,
				experience: interviewer.experience,
				bio: interviewer.bio,
				role: interviewer.role,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.delete(`/delete-interviewer/${interviewer.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(204)
	})
})
