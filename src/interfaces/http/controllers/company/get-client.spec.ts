import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import type { DOCUMENT_TYPE, GENDER } from '@prisma/client'
import request from 'supertest'
import { UniqueEntityID } from '../../../../domain/core/entities/unique-entity'

describe('Get Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get a client by id', async () => {
		const { token, companyId } = await createAndAuthenticateCompany(app)

		const client = makeClient({
			companyId: new UniqueEntityID(companyId),
		})

		await prisma.client.create({
			data: {
				id: client.id.toString(),
				name: client.name,
				document_type: client.documentType as DOCUMENT_TYPE,
				document: client.document,
				birth_date: client.birthDate,
				age: client.age,
				email: client.email,
				gender: client.gender as GENDER,
				phone: client.phone,
				role: client.role,
				allergies: client.allergies,
				emergency_contact: client.emergencyContact,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.get(`/get-client/${client.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
	})

	it('should return 404 when client not found', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		const response = await request(app.server)
			.get('/get-client/invalid-client-id')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(404)
	})

	it('should return 401 when not authenticated', async () => {
		const response = await request(app.server)
			.get('/get-client/any-client-id')
			.send()

		expect(response.status).toEqual(401)
	})
})
