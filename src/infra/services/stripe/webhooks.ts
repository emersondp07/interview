import Stripe from 'stripe'
import { env } from '../../config'
import type {
	IStripeWebhooks,
	WebhookEvent,
} from './interfaces/stripe-webhooks'

export class StripeWebhooksService implements IStripeWebhooks {
	private readonly stripe: Stripe

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			httpClient: Stripe.createFetchHttpClient(),
		})
	}

	async validateEvent(
		rawBody: string,
		signature: string,
	): Promise<WebhookEvent> {
		const event = await this.constructEvent(rawBody, signature)

		return {
			id: event.id,
			type: event.type,
			data: event.data,
			created: event.created,
		}
	}

	async constructEvent(
		rawBody: string,
		signature: string,
	): Promise<Stripe.Event> {
		try {
			return this.stripe.webhooks.constructEvent(
				rawBody,
				signature,
				env.STRIPE_WEBHOOK_SECRET_KEY,
			)
		} catch (error) {
			// console.error('❌ Erro ao validar webhook:', error)
			throw new Error(`Webhook validation failed: ${(error as Error).message}`)
		}
	}

	getSupportedEventTypes(): string[] {
		return [
			'price.created',
			'checkout.session.completed',
			'payment_intent.succeeded',
			'payment_intent.payment_failed',
			'invoice.created',
			'invoice.paid',
			'invoice.payment_failed',
		]
	}
}
