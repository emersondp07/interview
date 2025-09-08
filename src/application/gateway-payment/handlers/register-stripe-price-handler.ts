import type { RegisterStripePriceIdUseCase } from '../use-cases/register-stripe-price-id'
import type { IEventHandler } from '../interfaces/event-handler'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { WebhookResult } from '../interfaces/webhook-processor'

export class RegisterStripePriceHandler implements IEventHandler {
	constructor(
		private readonly registerStripePriceIdUseCase: RegisterStripePriceIdUseCase,
	) {}

	canHandle(eventType: string): boolean {
		return eventType === 'price.created'
	}

	async handle(event: WebhookEvent): Promise<WebhookResult> {
		try {
			const { product, id } = event.data.object

			await this.registerStripePriceIdUseCase.execute({
				productId: product as string,
				priceId: id,
			})

			console.log(`✅ Stripe price registered successfully: ${id} for product: ${product}`)

			return {
				success: true,
				message: 'Stripe price registered successfully',
				eventType: event.type,
			}
		} catch (error) {
			console.error('❌ Error handling price registration:', error)
			return {
				success: false,
				message: 'Failed to register stripe price',
				eventType: event.type,
				error: (error as Error).message,
			}
		}
	}
}