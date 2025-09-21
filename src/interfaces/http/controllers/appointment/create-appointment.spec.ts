import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Create Appointment (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create appointment', async () => {
		const { tokenClient, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow

		const response = await request(app.server)
			.post('/appointments')
			.set('Authorization', `Bearer ${tokenClient}`)
			.send({
				clientId: clientId,
				specialty: 'CLINICA_GERAL',
				scheduledAt: scheduledAt.toISOString(),
			})

		expect(response.status).toEqual(201)
		expect(response.body.appointment).toEqual(
			expect.objectContaining({
				specialty: 'CLINICA_GERAL',
				status: 'SCHEDULED',
			}),
		)
	})

	it('should not be able to create appointment without authentication', async () => {
		const response = await request(app.server)
			.post('/appointments')
			.send({
				clientId: 'some-client-id',
				specialty: 'CLINICA_GERAL',
				scheduledAt: new Date().toISOString(),
			})

		expect(response.status).toEqual(401)
	})
})