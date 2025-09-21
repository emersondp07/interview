import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeClient } from '@/tests/factories/make-client'
import request from 'supertest'

describe('Delete Client (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete client', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const client = makeClient()
		await prisma.client.create({
			data: {
				id: client.id.toString(),
				name: client.name,
				email: client.email,
				phone: client.phone,
				birth_date: client.birthDate,
				document_type: client.documentType,
				document: client.document,
				age: client.age,
				gender: client.gender,
				emergency_contact: client.emergencyContact,
				emergency_phone: client.emergencyPhone,
				allergies: client.allergies,
				medications: client.medications,
				role: client.role,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.delete(`/delete-client/${client.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(204)
	})
})
