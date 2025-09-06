import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import { env } from '@/infra/config'
import type { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { createAndAuthenticateAdministrator } from './create-and-authenticate-administrator'
import { makeClient } from './make-client'
import { makeCompany } from './make-company'
import { makeInterview } from './make-interview'
import { makeInterviewer } from './make-interviewer'
import { makePlan } from './make-plan'

interface CreateAndAuthenticateForVideoResponse {
	tokenClient: string
	tokenInterviewer: string
	companyId: string
	interviewId: string
	clientId: string
	interviewerId: string
	doctorId: string
	patientId: string
	clientDocument: string
}

export async function createAndAuthenticateForVideo(
	app: FastifyInstance,
): Promise<CreateAndAuthenticateForVideoResponse> {
	const { tokenAdmin } = await createAndAuthenticateAdministrator(app)

	// Create plan
	const plan = makePlan()

	await request(app.server)
		.post('/administrator/plan')
		.set('Authorization', `Bearer ${tokenAdmin}`)
		.send({
			name: plan.name,
			price: plan.price.toString(),
			permissions: plan.permissions,
		})

	// Create company
	const company = makeCompany()

	await request(app.server)
		.post('/administrator/company')
		.set('Authorization', `Bearer ${tokenAdmin}`)
		.send({
			name: company.name,
			email: company.email,
			phone: company.phone,
			address: company.address,
			planId: plan.id.toString(),
		})

	// Authenticate company
	const authCompanyResponse = await request(app.server)
		.post('/company/sessions')
		.send({
			email: company.email,
		})

	const { token: tokenCompany } = authCompanyResponse.body

	// Create interviewer
	const interviewer = makeInterviewer({
		companyId: company.id,
	})

	const createInterviewerResponse = await request(app.server)
		.post('/company/interviewer')
		.set('Authorization', `Bearer ${tokenCompany}`)
		.send({
			name: interviewer.name,
			email: interviewer.email,
			specialty: interviewer.specialty,
			profissionalRegistration: interviewer.profissionalRegistration,
			numberRegistration: interviewer.numberRegistration,
			experience: interviewer.experience,
			bio: interviewer.bio,
		})

	const { interviewer: createdInterviewer } = createInterviewerResponse.body

	// Authenticate interviewer
	const authInterviewerResponse = await request(app.server)
		.post('/interviewer/sessions')
		.send({
			email: interviewer.email,
		})

	const { token: tokenInterviewer } = authInterviewerResponse.body

	// Create client
	const client = makeClient({
		companyId: company.id,
	})

	const createClientResponse = await request(app.server)
		.post('/company/client')
		.set('Authorization', `Bearer ${tokenCompany}`)
		.send({
			name: client.name,
			email: client.email,
			document: client.document,
			phone: client.phone,
			address: client.address,
			gender: client.gender,
			birthDate: client.birthDate,
		})

	const { client: createdClient } = createClientResponse.body

	// Authenticate client
	const authClientResponse = await request(app.server)
		.post('/client/sessions')
		.send({
			document: client.document,
		})

	const { token: tokenClient } = authClientResponse.body

	// Create interview
	const interview = makeInterview({
		clientId: createdClient.client.id,
		interviewerId: createdInterviewer.interviewer.id,
		companyId: company.id,
	})

	return {
		tokenClient,
		tokenInterviewer,
		companyId: company.id.toString(),
		interviewId: interview.id.toString(),
		clientId: createdClient.client.id.value,
		interviewerId: createdInterviewer.interviewer.id.value,
		doctorId: createdInterviewer.interviewer.id.value, // Same as interviewer
		patientId: createdClient.client.id.value, // Same as client
		clientDocument: client.document,
	}
}