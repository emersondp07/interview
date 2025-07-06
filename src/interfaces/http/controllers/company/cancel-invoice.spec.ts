import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { makeInvoice } from '@/tests/factories/make-invoice'
import request from 'supertest'

describe('Cancel Invoice (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to cancel invoice', async () => {
		const { token, companyId, signatureId } =
			await createAndAuthenticateCompany(app)

		const invoice1 = makeInvoice()
		await prisma.invoice.create({
			data: {
				id: invoice1.id.toString(),
				value: invoice1.value,
				mounth: invoice1.mounth,
				status: invoice1.status,
				signature_id: signatureId,
				dueDate: invoice1.dueDate,
				issueDate: invoice1.issueDate,
				stripe_invoice_id: invoice1.stripeInvoiceId,
			},
		})

		const response = await request(app.server)
			.delete(`/cancel-invoice/${invoice1.id.toString()}/${signatureId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		// expect(response.status).toEqual(204)
	})
})
