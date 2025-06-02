import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import { makeSignature } from '@/tests/factories/make-signature'
import request from 'supertest'
import { makeInterviewer } from '../../../../tests/factories/make-interviewer'

describe('Delete Interviewer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete interviewer', async () => {
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

		const interviewer = makeInterviewer()

		await prisma.interviewer.create({
			data: {
				id: interviewer.id.toString(),
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				role: interviewer.role,
				company_id: company.id.toString(),
			},
		})

		const response = await request(app.server)
			.delete(
				`/delete-interviewer/${company.id.toString()}/${interviewer.id.toString()}`,
			)
			.send()

		expect(response.status).toEqual(204)
	})
})
