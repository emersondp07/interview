import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Create Triage (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create triage', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.post('/triages')
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				clientId: clientId,
				notes: 'Patient appears stable',
				vitalSigns: {
					bloodPressure: '120/80',
					heartRate: 72,
					temperature: 36.5,
				},
				nurseName: 'Jane Doe',
			})

		expect(response.status).toEqual(201)
		expect(response.body.triage).toEqual(
			expect.objectContaining({
				notes: 'Patient appears stable',
				nurse_name: 'Jane Doe',
			}),
		)
	})

	it('should not be able to create triage without authentication', async () => {
		const response = await request(app.server)
			.post('/triages')
			.send({
				clientId: 'some-client-id',
				nurseName: 'Jane Doe',
			})

		expect(response.status).toEqual(401)
	})
})