import type { ActiveSignatureUseCase } from '../use-cases/active-signature'
import type { IEventHandler } from '../interfaces/event-handler'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { WebhookResult } from '../interfaces/webhook-processor'

export class CheckoutCompletedHandler implements IEventHandler {
	constructor(private readonly activeSignatureUseCase: ActiveSignatureUseCase) {}

	canHandle(eventType: string): boolean {
		return eventType === 'checkout.session.completed'
	}

	async handle(event: WebhookEvent): Promise<WebhookResult> {
		try {
			const session = event.data.object

			if (session.object !== 'checkout.session') {
				throw new Error('Invalid event object: expected checkout.session')
			}

			const { customer, subscription, status } = session

			await this.activeSignatureUseCase.execute({
				companyId: customer as string,
				subscriptionId: subscription as string,
				stripeSubscriptionStatus: status as string,
			})

			console.log(`✅ Signature activated successfully for customer: ${customer}`)

			return {
				success: true,
				message: 'Signature activated successfully',
				eventType: event.type,
			}
		} catch (error) {
			console.error('❌ Error handling checkout completed:', error)
			return {
				success: false,
				message: 'Failed to activate signature',
				eventType: event.type,
				error: (error as Error).message,
			}
		}
	}
}