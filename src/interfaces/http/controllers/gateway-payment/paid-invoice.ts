import { PaidInvoiceUseCase } from '@/application/gateway-payment/use-cases/paid-invoice'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type Stripe from 'stripe'

export async function paidInvoice(event: Stripe.InvoicePaidEvent) {
	const { customer } = event.data.object as Stripe.Invoice

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const paidInvoiceUseCase = new PaidInvoiceUseCase(
		prismaInvoicesRepository,
		prismaCompaniesRepository,
	)

	await paidInvoiceUseCase.execute({
		customerId: customer as string,
	})

	return {
		status: 'success',
		message: 'Invoice paid successfully',
	}
}
