import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { IEventHandler } from '../interfaces/event-handler'
import type { WebhookResult } from '../interfaces/webhook-processor'
import type { CreateInvoiceUseCase } from '../use-cases/create-invoice'

export class CreateInvoiceHandler implements IEventHandler {
	constructor(private readonly createInvoiceUseCase: CreateInvoiceUseCase) {}

	canHandle(eventType: string): boolean {
		return eventType === 'invoice.created'
	}

	async handle(event: WebhookEvent): Promise<WebhookResult> {
		try {
			const { lines, customer, amount_paid, id } = event.data.object

			await this.createInvoiceUseCase.execute({
				mounth: lines.data[0].period.start.toString(),
				value: amount_paid.toString(),
				companyId: customer as string,
				stripeInvoiceId: id as string,
			})

			console.log(
				`✅ Invoice created successfully: ${id} for customer: ${customer}`,
			)

			return {
				success: true,
				message: 'Invoice created successfully',
				eventType: event.type,
			}
		} catch (error) {
			console.error('❌ Error handling invoice creation:', error)
			return {
				success: false,
				message: 'Failed to create invoice',
				eventType: event.type,
				error: (error as Error).message,
			}
		}
	}
}
