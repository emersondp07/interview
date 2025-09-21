import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import { SPECIALTIES } from '@prisma/client'
import request from 'supertest'

describe('Cancel Appointment (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to cancel appointment', async () => {
		const { tokenClient, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const appointment = await prisma.appointment.create({
			data: {
				client_id: clientId,
				specialty: SPECIALTIES.CLINICA_GERAL,
				status: 'SCHEDULED',
				scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
			},
		})

		const response = await request(app.server)
			.delete(`/appointments/${appointment.id}`)
			.set('Authorization', `Bearer ${tokenClient}`)

		expect(response.status).toEqual(204)

		// Verify the appointment was cancelled
		const cancelledAppointment = await prisma.appointment.findUnique({
			where: { id: appointment.id },
		})

		expect(cancelledAppointment?.status).toBe('CANCELED')
	})
})