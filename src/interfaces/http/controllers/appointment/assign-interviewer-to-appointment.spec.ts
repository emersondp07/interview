import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { ROLE, SPECIALTIES, type GENDER } from '@prisma/client'
import request from 'supertest'

describe('Assign Interviewer to Appointment (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to assign interviewer to appointment', async () => {
		const { token, companyId } = await createAndAuthenticateCompany(app)

		// Create client
		const client = makeClient()
		await prisma.client.create({
			data: {
				id: client.id.toString(),
				name: client.name,
				email: client.email,
				birth_date: client.birthDate,
				document_type: client.documentType,
				document: client.document,
				phone: client.phone,
				age: client.age,
				gender: client.gender as GENDER,
				role: ROLE.CLIENT,
				company_id: companyId,
			},
		})

		// Create interviewer
		const interviewer = makeInterviewer()
		const createdInterviewer = await prisma.interviewer.create({
			data: {
				id: interviewer.id.toString(),
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				specialty: interviewer.specialty,
				profissional_registration: interviewer.profissionalRegistration,
				number_registration: interviewer.numberRegistration,
				experience: interviewer.experience,
				bio: interviewer.bio,
				role: ROLE.INTERVIEWER,
				company_id: companyId,
			},
		})

		// Create appointment
		const appointment = await prisma.appointment.create({
			data: {
				client_id: client.id.toString(),
				specialty: SPECIALTIES.CLINICA_GERAL,
				status: 'SCHEDULED',
				scheduled_at: new Date(),
			},
		})

		const response = await request(app.server)
			.put(`/appointments/${appointment.id}/assign-interviewer`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				interviewerId: createdInterviewer.id,
			})

		expect(response.status).toEqual(204)

		// Verify the interviewer was assigned
		const updatedAppointment = await prisma.appointment.findUnique({
			where: { id: appointment.id },
		})

		expect(updatedAppointment?.interviewer_id).toBe(createdInterviewer.id)
	})
})