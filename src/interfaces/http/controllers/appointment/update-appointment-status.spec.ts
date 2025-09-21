import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import { SPECIALTIES } from '@prisma/client'
import request from 'supertest'

describe('Update Appointment Status (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update appointment status', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const appointment = await prisma.appointment.create({
			data: {
				client_id: clientId,
				specialty: SPECIALTIES.CLINICA_GERAL,
				status: 'SCHEDULED',
				scheduled_at: new Date(),
			},
		})

		const response = await request(app.server)
			.put(`/appointments/${appointment.id}/status`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				status: 'IN_PROGRESS',
			})

		expect(response.status).toEqual(204)

		// Verify the appointment status was updated
		const updatedAppointment = await prisma.appointment.findUnique({
			where: { id: appointment.id },
		})

		expect(updatedAppointment?.status).toBe('IN_PROGRESS')
	})
})