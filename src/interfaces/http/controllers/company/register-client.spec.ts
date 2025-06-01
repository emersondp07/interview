import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import request from 'supertest'
import { makeClient } from '../../../../tests/factories/make-client'

describe('Register Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register client', async () => {
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
				corporate_reason: company.corporateReason,
				cnpj: company.cnpj,
				email: company.email,
				password: company.password,
				phone: company.phone,
				plan_id: plan.id.toString(),
				role: company.role,
			},
		})

		const client = makeClient()

		const response = await request(app.server).post('/register-client').send({
			name: client.name,
			email: client.email,
			birthDate: '1990-01-01',
			phone: client.phone,
			documentType: client.documentType,
			document: client.document,
			companyId: company.id.toString(),
		})

		expect(response.status).toEqual(201)
	})
})
