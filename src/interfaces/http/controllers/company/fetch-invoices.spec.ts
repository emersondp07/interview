import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makeInvoice } from '@/tests/factories/make-invoice'
import { makePlan } from '@/tests/factories/make-plan'
import { makeSignature } from '@/tests/factories/make-signature'
import request from 'supertest'

describe('Fetch Invoices (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the invoices', async () => {
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

		const invoice1 = makeInvoice()
		await prisma.invoice.create({
			data: {
				value: invoice1.value,
				mounth: invoice1.mounth,
				status: invoice1.status,
				signature_id: signature.id.toString(),
				dueDate: invoice1.dueDate,
				issueDate: invoice1.issueDate,
			},
		})

		const invoice2 = makeInvoice()
		await prisma.invoice.create({
			data: {
				value: invoice2.value,
				mounth: invoice2.mounth,
				status: invoice2.status,
				signature_id: signature.id.toString(),
				dueDate: invoice2.dueDate,
				issueDate: invoice2.issueDate,
			},
		})

		const response = await request(app.server).get('/fetch-invoices').send()

		expect(response.status).toEqual(200)
	})
})
