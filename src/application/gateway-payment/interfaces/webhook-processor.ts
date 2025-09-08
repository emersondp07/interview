export interface WebhookResult {
	success: boolean
	message: string
	eventType: string
	error?: string
}

export interface IWebhookProcessor {
	processWebhook(rawBody: string, signature: string): Promise<WebhookResult>
	getSupportedEvents(): string[]
}