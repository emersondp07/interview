import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInvoice } from '@/tests/factories/make-invoice'
import request from 'supertest'

describe('Fetch Invoices (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the invoices', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const invoice1 = makeInvoice()
		await prisma.invoice.create({
			data: {
				value: invoice1.value,
				mounth: invoice1.mounth,
				status: invoice1.status,
				signature_id: signatureId,
				dueDate: invoice1.dueDate,
				issueDate: invoice1.issueDate,
			},
		})

		const invoice2 = makeInvoice()
		await prisma.invoice.create({
			data: {
				value: invoice2.value,
				mounth: invoice2.mounth,
				status: invoice2.status,
				signature_id: signatureId,
				dueDate: invoice2.dueDate,
				issueDate: invoice2.issueDate,
			},
		})

		const response = await request(app.server)
			.get('/fetch-invoices')
			.set('Authorization', `Bearer ${token}`)
			.send()

		// expect(response.status).toEqual(200)
	})
})
