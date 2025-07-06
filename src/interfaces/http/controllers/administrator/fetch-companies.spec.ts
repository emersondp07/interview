import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateAdministrator } from '@/tests/factories/create-and-authenticate-administrator'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe('Fetch Companies (e2e)', () => {
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

		await prisma.company.create({
			data: {
				corporate_reason: 'Company Name 1',
				cnpj: '00.000.000/0001-91',
				email: 'company1@email.com',
				password: faker.internet.password(),
				phone: '99999999999',
				plan_id: plan[0].id,
				role: 'COMPANY',
			},
		})

		await prisma.company.create({
			data: {
				corporate_reason: 'Company Name 2',
				cnpj: '00.000.000/0001-92',
				email: 'company2@email.com',
				password: faker.internet.password(),
				phone: '99999999999',
				plan_id: plan[0].id,
				role: 'COMPANY',
			},
		})

		const response = await request(app.server)
			.get('/fetch-companies')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
