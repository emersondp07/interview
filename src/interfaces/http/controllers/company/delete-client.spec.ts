import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeClient } from '@/tests/factories/make-client'
import request from 'supertest'
import { createAndAuthenticateCompany } from '../../../../tests/factories/create-and-authenticate-company'

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
				role: client.role,
				company_id: companyId,
			},
		})

		const response = await request(app.server)
			.delete(`/delete-client/${client.id.toString()}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		// expect(response.status).toEqual(204)
	})
})
