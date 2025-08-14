import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryResendEmailsService } from '@/tests/repositories/in-memory-resend-emails-service'
import request from 'supertest'

describe('Create Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()

		vi.mock('@/infra/services/email/emails', () => {
			return {
				ResendEmailsService: vi
					.fn()
					.mockImplementation(() => new InMemoryResendEmailsService()),
			}
		})
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
				specialty: interviewer.specialty,
				profissionalRegistration: interviewer.profissionalRegistration,
				numberRegistration: interviewer.numberRegistration,
				experience: interviewer.experience,
				bio: interviewer.bio,
				companyId: companyId,
			})

		expect(response.status).toEqual(201)
	})
})
