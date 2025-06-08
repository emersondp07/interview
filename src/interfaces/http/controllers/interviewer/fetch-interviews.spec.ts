import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import { makeInterview } from '@/tests/factories/make-interview'
import request from 'supertest'

describe('Fetch Interviews (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the interviews', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const client1 = makeClient()

		await prisma.client.create({
			data: {
				id: client1.id.toString(),
				name: client1.name,
				document_type: 'CPF',
				document: client1.document,
				birth_date: new Date('10-09-1996'),
				email: client1.email,
				phone: client1.phone,
				role: 'CLIENT',
				company_id: companyId,
			},
		})

		const client2 = makeClient({
			document: '2132132132',
		})

		await prisma.client.create({
			data: {
				id: client2.id.toString(),
				name: client2.name,
				document_type: 'CPF',
				document: client2.document,
				birth_date: new Date('10-09-1996'),
				email: client2.email,
				phone: client2.phone,
				role: 'CLIENT',
				company_id: companyId,
			},
		})

		const interview1 = makeInterview()
		await prisma.interview.create({
			data: {
				status: interview1.status,
				client_id: client1.id.toString(),
				company_id: companyId,
			},
		})

		const interview2 = makeInterview()
		await prisma.interview.create({
			data: {
				status: interview2.status,
				client_id: client2.id.toString(),
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.get('/fetch-invoices')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
