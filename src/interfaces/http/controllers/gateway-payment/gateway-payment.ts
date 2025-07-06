import { ActiveSignatureUseCase } from '@/application/company/use-cases/active-signature'
import { CreateInvoiceUseCase } from '@/application/company/use-cases/create-invoice'
import { PaidInvoiceUseCase } from '@/application/company/use-cases/paid-invoice'
import { env } from '@/infra/config'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import { PrismaSignaturesRepository } from '@/infra/database/repositories/prisma-signatures-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import Stripe from 'stripe'

export async function gatewayPayment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
		apiVersion: '2025-05-28.basil',
	})
	const sig = request.headers['stripe-signature']
	const rawBody = request.rawBody as string

	if (!sig || typeof sig !== 'string') {
		return reply.status(400).send('Missing Stripe signature')
	}

	if (!rawBody) {
		return reply.status(400).send('Missing rawBody')
	}

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(
			rawBody,
			sig,
			env.STRIPE_WEBHOOK_SECRET_KEY,
		)
	} catch (err) {
		console.error('❌ Erro ao validar webhook:', err)
		return reply.status(400).send(`Webhook Error: ${(err as Error).message}`)
	}

	if (event.type === 'checkout.session.completed') {
		const prismaSignaturesRepository = new PrismaSignaturesRepository()
		const prismaCompaniesRepository = new PrismaCompaniesRepository()
		const activeSignatureUseCase = new ActiveSignatureUseCase(
			prismaSignaturesRepository,
			prismaCompaniesRepository,
		)
		await activeSignatureUseCase.execute({
			companyId: event.data.object.customer as string,
		})
	} else if (event.type === 'invoice.created') {
		const prismaInvoicesRepository = new PrismaInvoicesRepository()
		const prismaCompaniesRepository = new PrismaCompaniesRepository()
		const createInvoiceUseCase = new CreateInvoiceUseCase(
			prismaInvoicesRepository,
			prismaCompaniesRepository,
		)
		await createInvoiceUseCase.execute({
			mounth: event.data.object.lines.data[0].period.start.toString(),
			value: event.data.object.amount_paid.toString(),
			companyId: event.data.object.customer as string,
			stripeInvoiceId: event.data.object.id as string,
		})
	} else if (event.type === 'invoice.paid') {
		const prismaInvoicesRepository = new PrismaInvoicesRepository()
		const prismaCompaniesRepository = new PrismaCompaniesRepository()
		const paidInvoiceUseCase = new PaidInvoiceUseCase(
			prismaInvoicesRepository,
			prismaCompaniesRepository,
		)
		await paidInvoiceUseCase.execute({
			companyId: event.data.object.customer as string,
		})
	} else if (event.type === 'invoice.payment_failed') {
	} else if (event.type === 'customer.subscription.created') {
	} else if (event.type === 'customer.subscription.updated') {
	} else if (event.type === 'customer.subscription.deleted') {
	} else {
		console.warn(`Unhandled event type: ${event.type}`)
	}

	return reply.status(200).send({ received: true })
}
