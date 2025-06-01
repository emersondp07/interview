import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import { makeSignature } from '@/tests/factories/make-signature'
import request from 'supertest'
import { makeClient } from '../../../../tests/factories/make-client'

describe('Delete Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete client', async () => {
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
				phone: client.phone,
				birthDate: client.birthDate,
				documentType: client.documentType,
				document: client.document,
				role: client.role,
				company_id: company.id.toString(),
			},
		})

		const response = await request(app.server)
			.delete(`/delete-client/${client.id.toString()}`)
			.send()

		expect(response.status).toEqual(204)
	})
})
