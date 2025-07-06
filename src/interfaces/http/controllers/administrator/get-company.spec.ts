import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateAdministrator } from '@/tests/factories/create-and-authenticate-administrator'
import { makeCompany } from '@/tests/factories/make-company'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Get Company (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the companies', async () => {
		const { token } = await createAndAuthenticateAdministrator(app)

		await prisma.plan.create({
			data: {
				name: 'Name plan',
				price: '29,90',
				description: 'Description plan',
				interview_limit: 100,
				stripe_product_id: faker.string.uuid(),
			},
		})

		const plan = await prisma.plan.findMany()
		const company = makeCompany({
			planId: plan[0].id,
		})

		await prisma.company.create({
			data: {
				id: company.id.toString(),
				corporate_reason: company.corporateReason,
				cnpj: company.cnpj,
				email: company.email,
				password: company.password,
				phone: company.phone,
				plan_id: company.planId,
				role: company.role,
			},
		})

		const response = await request(app.server)
			.get(`/get-company/${company.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
