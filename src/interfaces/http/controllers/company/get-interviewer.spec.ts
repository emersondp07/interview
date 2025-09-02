import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { UniqueEntityID } from '../../../../domain/core/entities/unique-entity'

describe('Get Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get an interviewer by id', async () => {
		const { token, companyId } = await createAndAuthenticateCompany(app)

		const interviewer = makeInterviewer({
			companyId: new UniqueEntityID(companyId),
		})

		await prisma.interviewer.create({
			data: {
				id: interviewer.id.toString(),
				name: interviewer.name,
				email: interviewer.email,
				bio: interviewer.bio,
				number_registration: interviewer.numberRegistration,
				profissional_registration: interviewer.profissionalRegistration,
				password: await hash(interviewer.password, 10),
				role: interviewer.role,
				specialty: interviewer.specialty,
				experience: interviewer.experience,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.get(`/get-interviewer/${interviewer.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
		expect(response.body).toHaveProperty('interviewer')
		expect(response.body.interviewer).toHaveProperty(
			'id',
			interviewer.id.toString(),
		)
		expect(response.body.interviewer).toHaveProperty('email', interviewer.email)
	})

	it('should return 404 when interviewer not found', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		const response = await request(app.server)
			.get('/get-interviewer/invalid-interviewer-id')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(404)
	})

	it('should return 401 when not authenticated', async () => {
		const response = await request(app.server)
			.get('/get-interviewer/any-interviewer-id')
			.send()

		expect(response.status).toEqual(401)
	})
})
