import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateAdministrator } from '@/tests/factories/create-and-authenticate-administrator'
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { makePlan } from '../../../../tests/factories/make-plan'
import { makeSignature } from '../../../../tests/factories/make-signature'

describe('Fetch Companies (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the companies', async () => {
		const { token } = await createAndAuthenticateAdministrator(app)
		const plan = makePlan()

		await prisma.plan.create({
			data: {
				id: plan.id.toString(),
				name: plan.name,
				price: plan.price,
				description: plan.description,
				interview_limit: plan.interviewLimit,
				stripe_product_id: plan.stripeProductId,
			},
		})

		const signature1 = makeSignature()

		await prisma.signature.create({
			data: {
				id: signature1.id.toString(),
				plan_id: plan.id.toString(),
				status: 'CHECKOUT',
			},
		})

		await prisma.company.create({
			data: {
				corporate_reason: 'Company Name 1',
				cnpj: '00.000.000/0001-91',
				email: 'company1@email.com',
				password: faker.internet.password(),
				phone: '99999999999',
				plan_id: plan.id.toString(),
				role: 'COMPANY',
				signature: {
					connect: {
						id: signature1.id.toString(),
					},
				},
			},
		})

		const signature2 = makeSignature()

		await prisma.signature.create({
			data: {
				id: signature2.id.toString(),
				plan_id: plan.id.toString(),
				status: 'CHECKOUT',
			},
		})

		await prisma.company.create({
			data: {
				corporate_reason: 'Company Name 2',
				cnpj: '00.000.000/0001-92',
				email: 'company2@email.com',
				password: faker.internet.password(),
				phone: '99999999999',
				plan_id: plan.id.toString(),
				role: 'COMPANY',
				signature: {
					connect: {
						id: signature2.id.toString(),
					},
				},
			},
		})

		const response = await request(app.server)
			.get('/fetch-companies')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
