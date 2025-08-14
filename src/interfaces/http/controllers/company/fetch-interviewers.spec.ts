import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Fetch Interviewers (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the interviewers', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const interviewer1 = makeInterviewer()
		await prisma.interviewer.create({
			data: {
				id: interviewer1.id.toString(),
				name: interviewer1.name,
				email: interviewer1.email,
				password: await hash(interviewer1.password, 10),
				specialty: interviewer1.specialty,
				number_registration: interviewer1.numberRegistration,
				profissional_registration: interviewer1.profissionalRegistration,
				experience: interviewer1.experience,
				bio: interviewer1.bio,
				role: interviewer1.role,
				company_id: companyId,
			},
		})

		const interviewer2 = makeInterviewer()
		await prisma.interviewer.create({
			data: {
				id: interviewer2.id.toString(),
				name: interviewer2.name,
				email: interviewer2.email,
				password: await hash(interviewer2.password, 10),
				specialty: interviewer2.specialty,
				number_registration: interviewer2.numberRegistration,
				profissional_registration: interviewer2.profissionalRegistration,
				experience: interviewer2.experience,
				bio: interviewer2.bio,
				role: interviewer2.role,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.get('/fetch-interviewers')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
