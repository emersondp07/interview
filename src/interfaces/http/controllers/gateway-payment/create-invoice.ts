import { CreateInvoiceUseCase } from '@/application/gateway-payment/use-cases/create-invoice'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type Stripe from 'stripe'

export async function createInvoice(event: Stripe.InvoiceCreatedEvent) {
	const { lines, customer, amount_paid, id } = event.data
		.object as Stripe.Invoice

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const createInvoiceUseCase = new CreateInvoiceUseCase(
		prismaInvoicesRepository,
		prismaCompaniesRepository,
	)

	await createInvoiceUseCase.execute({
		mounth: lines.data[0].period.start.toString(),
		value: amount_paid.toString(),
		companyId: customer as string,
		stripeInvoiceId: id as string,
	})

	return {
		status: 'success',
		message: 'Invoice created successfully',
	}
}
