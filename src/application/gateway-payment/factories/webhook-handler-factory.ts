import type { IEventHandler, IWebhookHandlerFactory } from '../interfaces/event-handler'

export class WebhookHandlerFactory implements IWebhookHandlerFactory {
	private handlers = new Map<string, IEventHandler>()

	registerHandlers(handlers: IEventHandler[]): void {
		for (const handler of handlers) {
			const supportedTypes = this.getSupportedTypes(handler)
			for (const type of supportedTypes) {
				this.handlers.set(type, handler)
				console.log(`Registered handler for event type: ${type}`)
			}
		}
	}

	getHandler(eventType: string): IEventHandler | null {
		return this.handlers.get(eventType) || null
	}

	private getSupportedTypes(handler: IEventHandler): string[] {
		// Lista de todos os tipos de evento possíveis
		const allEventTypes = [
			'price.created',
			'checkout.session.completed',
			'payment_intent.succeeded',
			'payment_intent.payment_failed',
			'invoice.created',
			'invoice.paid',
			'invoice.payment_failed',
		]

		// Retorna apenas os tipos que o handler pode processar
		return allEventTypes.filter(eventType => handler.canHandle(eventType))
	}

	getRegisteredEventTypes(): string[] {
		return Array.from(this.handlers.keys())
	}
}