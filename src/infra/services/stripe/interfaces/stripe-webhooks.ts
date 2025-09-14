import type Stripe from 'stripe'

export interface WebhookEvent {
	id: string
	type: string
	data: any
	created: number
}

export interface IStripeWebhooks {
	validateEvent(rawBody: string, signature: string): Promise<WebhookEvent>
	constructEvent(rawBody: string, signature: string): Promise<Stripe.Event>
	getSupportedEventTypes(): string[]
}
