import { prisma } from '@/infra/database/prisma/prisma'
import type { FastifyTypedInstance } from '@/interfaces/@types/instances.type'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { makeCompany } from './make-company'
import { makePlan } from './make-plan'
import { makeSignature } from './make-signature'

export async function createAndAuthenticateCompany(app: FastifyTypedInstance) {
	const plan = makePlan()
	await prisma.plan.create({
		data: {
			id: plan.id.toString(),
			name: plan.name,
			price: plan.price,
			description: plan.description,
			interview_limit: plan.interviewLimit,
			stripe_product_id: plan.stripeProductId,
			stripe_price_id: plan.stripePriceId,
		},
	})

	const signature = makeSignature()

	const company = makeCompany()

	await prisma.signature.create({
		data: {
			id: signature.id.toString(),
			plan_id: plan.id.toString(),
			status: 'ACTIVE',
		},
	})

	await prisma.company.create({
		data: {
			id: company.id.toString(),
			corporate_reason: company.corporateReason,
			email: company.email,
			password: await hash(company.password, 10),
			cnpj: company.cnpj,
			phone: company.phone,
			role: ROLE.COMPANY,
			plan_id: plan.id.toString(),
			signature: {
				connect: {
					id: signature.id.toString(),
				},
			},
		},
	})

	const authResponse = await request(app.server).post('/session-company').send({
		email: company.email,
		password: company.password,
	})

	const { token } = authResponse.body

	return {
		token,
		companyId: company.id.toString(),
		signatureId: signature.id.toString(),
	}
}
