import type { FastifyTypedInstance } from '@/interfaces/@types/instances.type'
import { ROLE } from '@prisma/client'
import request from 'supertest'
import { prisma } from '../../infra/database/prisma/prisma'
import { createAndAuthenticateCompany } from './create-and-authenticate-company'
import { makeClient } from './make-client'
import { makeInterview } from './make-interview'
import { makeInterviewer } from './make-interviewer'

export async function createAndAuthenticateClientInterviewer(
	app: FastifyTypedInstance,
) {
	const {
		token: tokenCompany,
		companyId,
		signatureId,
	} = await createAndAuthenticateCompany(app)

	const interviewer = makeInterviewer()

	await request(app.server)
		.post('/create-interviewer')
		.set('Authorization', `Bearer ${tokenCompany}`)
		.send({
			name: interviewer.name,
			email: interviewer.email,
			password: interviewer.password,
			companyId: companyId,
		})

	const responseInterviewer = await request(app.server)
		.post('/session-interviewer')
		.send({
			email: interviewer.email,
			password: interviewer.password,
		})

	const { token: tokenInterviewer } = responseInterviewer.body

	const client = makeClient()
	const interview = makeInterview()

	await prisma.client.create({
		data: {
			id: client.id.toString(),
			name: client.name,
			email: client.email,
			document: '12345678912',
			document_type: client.documentType,
			birth_date: client.birthDate,
			role: ROLE.CLIENT,
			phone: client.phone,
			age: client.age,
			gender: client.gender,
			emergency_contact: client.emergencyContact,
			emergency_phone: client.emergencyPhone,
			medical_history: client.medicalHistory,
			allergies: client.allergies,
			medications: client.medications,
			company_id: companyId,
			interviews: {
				create: {
					id: interview.id.toString(),
					status: interview.status,
					company_id: companyId,
				},
			},
		},
	})

	const responseClient = await request(app.server)
		.post('/session-client')
		.send({
			document: '12345678912',
		})

	const { token: tokenClient } = responseClient.body

	return {
		tokenClient,
		tokenInterviewer,
		companyId,
		signatureId,
		clientId: client.id.toString(),
		interviewId: interview.id.toString(),
	}
}
