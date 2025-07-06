import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
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
		await prisma.plan.create({
			data: {
				name: 'Name plan 1',
				price: '29,90',
				description: 'Description plan',
				interview_limit: 100,
				stripe_product_id: faker.string.uuid(),
			},
		})

		await prisma.plan.create({
			data: {
				name: 'Name plan 2',
				price: '39,90',
				description: 'Description plan',
				interview_limit: 100,
				stripe_product_id: faker.string.uuid(),
			},
		})

		const response = await request(app.server).get('/fetch-plans').send()

		expect(response.status).toEqual(200)
	})
})
