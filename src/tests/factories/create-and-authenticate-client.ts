import { prisma } from '@/infra/database/prisma/prisma'
import type { FastifyTypedInstance } from '@/interfaces/@types/instances.type'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { makeClient } from './make-client'
import { makeCompany } from './make-company'
import { makePlan } from './make-plan'
import { makeSignature } from './make-signature'

export async function createAndAuthenticateClient(app: FastifyTypedInstance) {
	const plan = makePlan()
	await prisma.plan.create({
		data: {
			id: plan.id.toString(),
			name: plan.name,
			price: plan.price,
			description: plan.description,
			interview_limit: plan.interviewLimit,
		},
	})

	const company = makeCompany()

	await prisma.company.create({
		data: {
			id: company.id.toString(),
			corporate_reason: 'Corporate',
			email: 'corporate@example.com',
			password: await hash(company.password, 10),
			cnpj: '165165165156',
			phone: '1231321321',
			role: ROLE.COMPANY,
			plan_id: plan.id.toString(),
		},
	})

	const signature = makeSignature()

	await prisma.signature.create({
		data: {
			id: signature.id.toString(),
			company_id: company.id.toString(),
			plan_id: plan.id.toString(),
			status: 'ACTIVE',
		},
	})

	const client = makeClient()

	await prisma.client.create({
		data: {
			id: client.id.toString(),
			name: client.name,
			email: client.email,
			document: client.document,
			document_type: client.documentType,
			birth_date: client.birthDate,
			role: ROLE.CLIENT,
			phone: client.phone,
			company_id: company.id.toString(),
		},
	})

	const authResponse = await request(app.server).post('/session-client').send({
		document: client.document,
	})

	const { token } = authResponse.body

	return {
		token,
		companyId: company.id.toString(),
		signatureId: signature.id.toString(),
	}
}
