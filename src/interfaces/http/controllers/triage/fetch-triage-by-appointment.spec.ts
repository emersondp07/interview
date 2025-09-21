import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import { SPECIALTIES } from '@prisma/client'
import request from 'supertest'

describe('Fetch Triage by Appointment (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch triage by appointment', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test appointment
		const appointment = await prisma.appointment.create({
			data: {
				client_id: clientId,
				specialty: SPECIALTIES.CLINICA_GERAL,
				status: 'SCHEDULED',
				scheduled_at: new Date(),
			},
		})

		// Create test triage
		const triage = await prisma.triage.create({
			data: {
				client_id: clientId,
				notes: 'Appointment triage notes',
				nurse_name: 'Appointment Nurse',
			},
		})

		// Link triage to appointment
		await prisma.appointment.update({
			where: { id: appointment.id },
			data: { triage_id: triage.id },
		})

		const response = await request(app.server)
			.get(`/appointments/${appointment.id}/triage`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body.triage).toEqual(
			expect.objectContaining({
				notes: 'Appointment triage notes',
				nurse_name: 'Appointment Nurse',
			}),
		)
	})
})