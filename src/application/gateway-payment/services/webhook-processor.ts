import type { IStripeWebhooks } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { IWebhookHandlerFactory } from '../interfaces/event-handler'
import type {
	IWebhookProcessor,
	WebhookResult,
} from '../interfaces/webhook-processor'

export class WebhookProcessorService implements IWebhookProcessor {
	constructor(
		private readonly stripeWebhooks: IStripeWebhooks,
		private readonly handlerFactory: IWebhookHandlerFactory,
	) {}

	async processWebhook(
		rawBody: string,
		signature: string,
	): Promise<WebhookResult> {
		try {
			// Validar evento usando Stripe service
			const event = await this.stripeWebhooks.validateEvent(rawBody, signature)

			// Buscar handler apropriado
			const handler = this.handlerFactory.getHandler(event.type)

			if (!handler) {
				console.warn(`Event type '${event.type}' not supported`)
				return {
					success: true, // 200 para Stripe, mas não processamos
					message: `Event type '${event.type}' not supported`,
					eventType: event.type,
				}
			}

			// Processar evento
			return await handler.handle(event)
		} catch (error) {
			console.error('Error processing webhook:', error)
			return {
				success: false,
				message: 'Failed to process webhook',
				eventType: 'unknown',
				error: (error as Error).message,
			}
		}
	}

	getSupportedEvents(): string[] {
		return this.stripeWebhooks.getSupportedEventTypes()
	}
}
