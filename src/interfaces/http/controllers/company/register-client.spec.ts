import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryResendEmailsService } from '@/tests/repositories/in-memory-resend-emails-service'
import request from 'supertest'

describe('Register Client (e2e)', () => {
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
				age: client.age,
				gender: client.gender,
				emergencyContact: client.emergencyContact,
				emergencyPhone: client.emergencyPhone,
				medicalHistory: client.medicalHistory,
				allergies: client.allergies,
				medications: client.medications,
				companyId,
			})

		expect(response.status).toEqual(201)
	})
})
