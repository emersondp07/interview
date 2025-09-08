import type { PaidInvoiceUseCase } from '../use-cases/paid-invoice'
import type { IEventHandler } from '../interfaces/event-handler'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { WebhookResult } from '../interfaces/webhook-processor'

export class PaidInvoiceHandler implements IEventHandler {
	constructor(private readonly paidInvoiceUseCase: PaidInvoiceUseCase) {}

	canHandle(eventType: string): boolean {
		return eventType === 'invoice.paid'
	}

	async handle(event: WebhookEvent): Promise<WebhookResult> {
		try {
			const { customer } = event.data.object

			await this.paidInvoiceUseCase.execute({
				customerId: customer as string,
			})

			console.log(`✅ Invoice paid successfully for customer: ${customer}`)

			return {
				success: true,
				message: 'Invoice paid successfully',
				eventType: event.type,
			}
		} catch (error) {
			console.error('❌ Error handling invoice payment:', error)
			return {
				success: false,
				message: 'Failed to process invoice payment',
				eventType: event.type,
				error: (error as Error).message,
			}
		}
	}
}