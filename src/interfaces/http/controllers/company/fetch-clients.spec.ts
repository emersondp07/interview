import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import type { GENDER } from '@prisma/client'
import request from 'supertest'

describe('Fetch Clients (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the clients', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const client1 = makeClient()
		await prisma.client.create({
			data: {
				id: client1.id.toString(),
				name: client1.name,
				email: client1.email,
				birth_date: client1.birthDate,
				document_type: client1.documentType,
				document: client1.document,
				phone: client1.phone,
				age: client1.age,
				gender: client1.gender as GENDER,
				role: client1.role,
				company_id: companyId,
			},
		})

		const client2 = makeClient()
		await prisma.client.create({
			data: {
				id: client2.id.toString(),
				name: client2.name,
				email: client2.email,
				birth_date: client2.birthDate,
				document_type: client2.documentType,
				document: client2.document,
				phone: client2.phone,
				age: client2.age,
				gender: client2.gender as GENDER,
				role: client2.role,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.get('/fetch-interviewers')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})
})
