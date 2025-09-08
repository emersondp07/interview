import type {
	IStripeWebhooks,
	WebhookEvent,
} from '@/infra/services/stripe/interfaces/stripe-webhooks'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
	IEventHandler,
	IWebhookHandlerFactory,
} from '../interfaces/event-handler'
import type { WebhookResult } from '../interfaces/webhook-processor'
import { WebhookProcessorService } from './webhook-processor'

// Mock implementations
class MockStripeWebhooks implements IStripeWebhooks {
	validateEvent = vi.fn()
	constructEvent = vi.fn()
	getSupportedEventTypes = vi.fn()
}

class MockEventHandler implements IEventHandler {
	canHandle = vi.fn()
	handle = vi.fn()
}

class MockWebhookHandlerFactory implements IWebhookHandlerFactory {
	getHandler = vi.fn()
	registerHandlers = vi.fn()
}

describe('WebhookProcessorService', () => {
	let webhookProcessor: WebhookProcessorService
	let mockStripeWebhooks: MockStripeWebhooks
	let mockHandlerFactory: MockWebhookHandlerFactory
	let mockHandler: MockEventHandler

	beforeEach(() => {
		mockStripeWebhooks = new MockStripeWebhooks()
		mockHandlerFactory = new MockWebhookHandlerFactory()
		mockHandler = new MockEventHandler()

		webhookProcessor = new WebhookProcessorService(
			mockStripeWebhooks,
			mockHandlerFactory,
		)
	})

	describe('processWebhook', () => {
		const mockEvent: WebhookEvent = {
			id: 'evt_test_123',
			type: 'checkout.session.completed',
			data: { object: { id: 'cs_test_123' } },
			created: 1234567890,
		}

		it('should process webhook successfully', async () => {
			const expectedResult: WebhookResult = {
				success: true,
				message: 'Event processed successfully',
				eventType: 'checkout.session.completed',
			}

			mockStripeWebhooks.validateEvent.mockResolvedValue(mockEvent)
			mockHandlerFactory.getHandler.mockReturnValue(mockHandler)
			mockHandler.handle.mockResolvedValue(expectedResult)

			const result = await webhookProcessor.processWebhook(
				'raw_body',
				'signature',
			)

			expect(result).toEqual(expectedResult)
			expect(mockStripeWebhooks.validateEvent).toHaveBeenCalledWith(
				'raw_body',
				'signature',
			)
			expect(mockHandlerFactory.getHandler).toHaveBeenCalledWith(
				'checkout.session.completed',
			)
			expect(mockHandler.handle).toHaveBeenCalledWith(mockEvent)
		})

		it('should handle unsupported event type gracefully', async () => {
			const unsupportedEvent: WebhookEvent = {
				id: 'evt_test_456',
				type: 'unsupported.event.type',
				data: {},
				created: 1234567890,
			}

			mockStripeWebhooks.validateEvent.mockResolvedValue(unsupportedEvent)
			mockHandlerFactory.getHandler.mockReturnValue(null)

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const result = await webhookProcessor.processWebhook(
				'raw_body',
				'signature',
			)

			expect(result).toEqual({
				success: true,
				message: "Event type 'unsupported.event.type' not supported",
				eventType: 'unsupported.event.type',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				"Event type 'unsupported.event.type' not supported",
			)
			expect(mockHandler.handle).not.toHaveBeenCalled()

			consoleSpy.mockRestore()
		})

		it('should handle webhook validation error', async () => {
			const validationError = new Error('Invalid signature')
			mockStripeWebhooks.validateEvent.mockRejectedValue(validationError)

			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await webhookProcessor.processWebhook(
				'raw_body',
				'invalid_signature',
			)

			expect(result).toEqual({
				success: false,
				message: 'Failed to process webhook',
				eventType: 'unknown',
				error: 'Invalid signature',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error processing webhook:',
				validationError,
			)
			expect(mockHandlerFactory.getHandler).not.toHaveBeenCalled()

			consoleSpy.mockRestore()
		})

		it('should handle handler execution error', async () => {
			const handlerError = new Error('Handler processing failed')

			mockStripeWebhooks.validateEvent.mockResolvedValue(mockEvent)
			mockHandlerFactory.getHandler.mockReturnValue(mockHandler)
			mockHandler.handle.mockRejectedValue(handlerError)

			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await webhookProcessor.processWebhook(
				'raw_body',
				'signature',
			)

			expect(result).toEqual({
				success: false,
				message: 'Failed to process webhook',
				eventType: 'unknown',
				error: 'Handler processing failed',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'Error processing webhook:',
				handlerError,
			)

			consoleSpy.mockRestore()
		})

		it('should handle handler returning error result', async () => {
			const errorResult: WebhookResult = {
				success: false,
				message: 'Handler specific error',
				eventType: 'checkout.session.completed',
				error: 'Use case failed',
			}

			mockStripeWebhooks.validateEvent.mockResolvedValue(mockEvent)
			mockHandlerFactory.getHandler.mockReturnValue(mockHandler)
			mockHandler.handle.mockResolvedValue(errorResult)

			const result = await webhookProcessor.processWebhook(
				'raw_body',
				'signature',
			)

			expect(result).toEqual(errorResult)
		})
	})

	describe('getSupportedEvents', () => {
		it('should return supported event types from stripe service', () => {
			const expectedEventTypes = [
				'checkout.session.completed',
				'invoice.created',
				'invoice.paid',
			]

			mockStripeWebhooks.getSupportedEventTypes.mockReturnValue(
				expectedEventTypes,
			)

			const result = webhookProcessor.getSupportedEvents()

			expect(result).toEqual(expectedEventTypes)
			expect(mockStripeWebhooks.getSupportedEventTypes).toHaveBeenCalled()
		})
	})
})
