import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import { SPECIALTIES } from '@prisma/client'
import request from 'supertest'

describe('Fetch Appointments by Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch appointments by client', async () => {
		const { tokenClient, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test appointments
		await prisma.appointment.create({
			data: {
				client_id: clientId,
				specialty: SPECIALTIES.CLINICA_GERAL,
				status: 'SCHEDULED',
				scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
			},
		})

		await prisma.appointment.create({
			data: {
				client_id: clientId,
				specialty: SPECIALTIES.CARDIOLOGIA,
				status: 'COMPLETED',
				scheduled_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
			},
		})

		const response = await request(app.server)
			.get(`/clients/${clientId}/appointments`)
			.set('Authorization', `Bearer ${tokenClient}`)

		expect(response.status).toEqual(200)
		expect(response.body.appointments).toHaveLength(2)
		expect(response.body.appointments[0]).toEqual(
			expect.objectContaining({
				specialty: expect.any(String),
				status: expect.any(String),
			}),
		)
	})
})