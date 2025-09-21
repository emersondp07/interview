import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Fetch Client Triages (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch client triages', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test triages
		await prisma.triage.create({
			data: {
				client_id: clientId,
				notes: 'First triage notes',
				nurse_name: 'Nurse 1',
				vital_signs: { heartRate: 70 },
			},
		})

		await prisma.triage.create({
			data: {
				client_id: clientId,
				notes: 'Second triage notes',
				nurse_name: 'Nurse 2',
				vital_signs: { heartRate: 80 },
			},
		})

		const response = await request(app.server)
			.get(`/clients/${clientId}/triages`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body.triages).toHaveLength(2)
		expect(response.body.triages[0]).toEqual(
			expect.objectContaining({
				notes: expect.any(String),
				nurseName: expect.any(String),
			}),
		)
	})
})