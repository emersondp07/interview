import { WebhookHandlerFactory } from '@/application/gateway-payment/factories/webhook-handler-factory'
import { CheckoutCompletedHandler } from '@/application/gateway-payment/handlers/checkout-completed-handler'
import { CreateInvoiceHandler } from '@/application/gateway-payment/handlers/create-invoice-handler'
import { PaidInvoiceHandler } from '@/application/gateway-payment/handlers/paid-invoice-handler'
import { RegisterStripePriceHandler } from '@/application/gateway-payment/handlers/register-stripe-price-handler'
import { WebhookProcessorService } from '@/application/gateway-payment/services/webhook-processor'
import { StripeWebhooksService } from '@/infra/services/stripe/webhooks'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { ActiveSignatureUseCase } from '@/application/gateway-payment/use-cases/active-signature'
import { CreateInvoiceUseCase } from '@/application/gateway-payment/use-cases/create-invoice'
import { PaidInvoiceUseCase } from '@/application/gateway-payment/use-cases/paid-invoice'
import { RegisterStripePriceIdUseCase } from '@/application/gateway-payment/use-cases/register-stripe-price-id'

import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import { PrismaSignaturesRepository } from '@/infra/database/repositories/prisma-signatures-repository'
import { ResendEmailsService } from '@/infra/services/email/emails'

export async function gatewayPayment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const sig = request.headers['stripe-signature']
	const rawBody = request.rawBody as string

	if (!sig || typeof sig !== 'string') {
		return reply.status(400).send({ error: 'Missing Stripe signature' })
	}

	if (!rawBody) {
		return reply.status(400).send({ error: 'Missing rawBody' })
	}

	try {
		const stripeWebhooks = new StripeWebhooksService()
		const handlerFactory = new WebhookHandlerFactory()

		const companiesRepository = new PrismaCompaniesRepository()
		const signaturesRepository = new PrismaSignaturesRepository()
		const invoicesRepository = new PrismaInvoicesRepository()
		const plansRepository = new PrismaPlansRepository()
		const emailService = new ResendEmailsService()

		const activeSignatureUseCase = new ActiveSignatureUseCase(
			signaturesRepository,
			companiesRepository,
			emailService,
		)
		const createInvoiceUseCase = new CreateInvoiceUseCase(
			invoicesRepository,
			companiesRepository,
		)
		const paidInvoiceUseCase = new PaidInvoiceUseCase(
			invoicesRepository,
			companiesRepository,
		)
		const registerStripePriceIdUseCase = new RegisterStripePriceIdUseCase(
			plansRepository,
		)

		const handlers = [
			new CheckoutCompletedHandler(activeSignatureUseCase),
			new CreateInvoiceHandler(createInvoiceUseCase),
			new PaidInvoiceHandler(paidInvoiceUseCase),
			new RegisterStripePriceHandler(registerStripePriceIdUseCase),
		]
		handlerFactory.registerHandlers(handlers)

		const processor = new WebhookProcessorService(
			stripeWebhooks,
			handlerFactory,
		)

		const result = await processor.processWebhook(rawBody, sig)

		if (!result.success) {
			console.error(`❌ Webhook processing failed: ${result.message}`)
			return reply.status(400).send({
				error: result.message,
				eventType: result.eventType,
			})
		}

		console.log(`✅ Webhook processed successfully: ${result.eventType}`)
		return reply.status(200).send({
			received: true,
			message: result.message,
			eventType: result.eventType,
		})
	} catch (error) {
		console.error('❌ Gateway payment error:', error)
		return reply.status(500).send({
			error: 'Internal server error',
			message: (error as Error).message,
		})
	}
}
