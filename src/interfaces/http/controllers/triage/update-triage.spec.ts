import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Update Triage (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update triage', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const triage = await prisma.triage.create({
			data: {
				client_id: clientId,
				notes: 'Original notes',
				nurse_name: 'Original Nurse',
				vital_signs: { heartRate: 70 },
			},
		})

		const response = await request(app.server)
			.put(`/triages/${triage.id}`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				notes: 'Updated notes',
				nurseName: 'Updated Nurse',
				vitalSigns: { heartRate: 75, temperature: 37.0 },
			})

		expect(response.status).toEqual(204)

		// Verify the triage was updated
		const updatedTriage = await prisma.triage.findUnique({
			where: { id: triage.id },
		})

		expect(updatedTriage).toEqual(
			expect.objectContaining({
				notes: 'Updated notes',
				nurse_name: 'Updated Nurse',
			}),
		)
	})
})