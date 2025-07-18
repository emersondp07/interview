import { env } from '@/infra/config'
import type { FastifyReply, FastifyRequest } from 'fastify'
import Stripe from 'stripe'
import { checkouCompleted } from './checkout-completed'
import { createInvoice } from './create-invoice'
import { paidInvoice } from './paid-invoice'
import { registerStripePriceId } from './register-stripe-price-id'

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

	if (event.type === 'price.created') {
		await registerStripePriceId(event as Stripe.PriceCreatedEvent)
	} else if (event.type === 'checkout.session.completed') {
		await checkouCompleted(event as Stripe.CheckoutSessionCompletedEvent)
	} else if (event.type === 'payment_intent.succeeded') {
		// await checkouCompleted(event as Stripe.PaymentIntentSucceededEvent)
	} else if (event.type === 'payment_intent.payment_failed') {
		// await checkouCompleted(event as Stripe.PaymentIntentPaymentFailedEvent)
	} else if (event.type === 'invoice.created') {
		await createInvoice(event as Stripe.InvoiceCreatedEvent)
	} else if (event.type === 'invoice.paid') {
		await paidInvoice(event as Stripe.InvoicePaidEvent)
	} else if (event.type === 'invoice.payment_failed') {
		console.warn(`Unhandled event type: ${event.type}`)
	} else {
		console.warn(`Unhandled event type: ${event.type}`)
	}

	return reply.status(200).send({ received: true })
}
