import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import type { WebhookResult } from './webhook-processor'

export interface IEventHandler {
	handle(event: WebhookEvent): Promise<WebhookResult>
	canHandle(eventType: string): boolean
}

export interface IWebhookHandlerFactory {
	getHandler(eventType: string): IEventHandler | null
	registerHandlers(handlers: IEventHandler[]): void
}
