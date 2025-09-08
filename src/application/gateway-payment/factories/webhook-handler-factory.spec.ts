import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IEventHandler } from '../interfaces/event-handler'
import { WebhookHandlerFactory } from './webhook-handler-factory'

// Mock handler para testes
class MockCheckoutHandler implements IEventHandler {
	canHandle(eventType: string): boolean {
		return eventType === 'checkout.session.completed'
	}

	async handle(): Promise<any> {
		return {
			success: true,
			message: 'Mock handled',
			eventType: 'checkout.session.completed',
		}
	}
}

class MockInvoiceHandler implements IEventHandler {
	canHandle(eventType: string): boolean {
		return eventType === 'invoice.created' || eventType === 'invoice.paid'
	}

	async handle(): Promise<any> {
		return { success: true, message: 'Mock handled', eventType: 'invoice' }
	}
}

describe('WebhookHandlerFactory', () => {
	let factory: WebhookHandlerFactory
	let mockCheckoutHandler: MockCheckoutHandler
	let mockInvoiceHandler: MockInvoiceHandler

	beforeEach(() => {
		factory = new WebhookHandlerFactory()
		mockCheckoutHandler = new MockCheckoutHandler()
		mockInvoiceHandler = new MockInvoiceHandler()
	})

	describe('registerHandlers', () => {
		it('should register handlers for their supported event types', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			factory.registerHandlers([mockCheckoutHandler, mockInvoiceHandler])

			expect(consoleSpy).toHaveBeenCalledWith(
				'Registered handler for event type: checkout.session.completed',
			)
			expect(consoleSpy).toHaveBeenCalledWith(
				'Registered handler for event type: invoice.created',
			)
			expect(consoleSpy).toHaveBeenCalledWith(
				'Registered handler for event type: invoice.paid',
			)

			consoleSpy.mockRestore()
		})

		it('should register multiple handlers correctly', () => {
			factory.registerHandlers([mockCheckoutHandler, mockInvoiceHandler])

			const checkoutHandler = factory.getHandler('checkout.session.completed')
			const invoiceCreatedHandler = factory.getHandler('invoice.created')
			const invoicePaidHandler = factory.getHandler('invoice.paid')

			expect(checkoutHandler).toBe(mockCheckoutHandler)
			expect(invoiceCreatedHandler).toBe(mockInvoiceHandler)
			expect(invoicePaidHandler).toBe(mockInvoiceHandler)
		})
	})

	describe('getHandler', () => {
		beforeEach(() => {
			factory.registerHandlers([mockCheckoutHandler, mockInvoiceHandler])
		})

		it('should return correct handler for supported event type', () => {
			const handler = factory.getHandler('checkout.session.completed')
			expect(handler).toBe(mockCheckoutHandler)
		})

		it('should return null for unsupported event type', () => {
			const handler = factory.getHandler('unsupported.event.type')
			expect(handler).toBeNull()
		})

		it('should return same handler instance for multiple calls', () => {
			const handler1 = factory.getHandler('invoice.created')
			const handler2 = factory.getHandler('invoice.created')

			expect(handler1).toBe(handler2)
			expect(handler1).toBe(mockInvoiceHandler)
		})
	})

	describe('getRegisteredEventTypes', () => {
		it('should return empty array when no handlers registered', () => {
			const eventTypes = factory.getRegisteredEventTypes()
			expect(eventTypes).toEqual([])
		})

		it('should return all registered event types', () => {
			factory.registerHandlers([mockCheckoutHandler, mockInvoiceHandler])

			const eventTypes = factory.getRegisteredEventTypes()

			expect(eventTypes).toContain('checkout.session.completed')
			expect(eventTypes).toContain('invoice.created')
			expect(eventTypes).toContain('invoice.paid')
			expect(eventTypes).toHaveLength(3)
		})
	})

	describe('edge cases', () => {
		it('should handle empty handlers array', () => {
			expect(() => factory.registerHandlers([])).not.toThrow()

			const handler = factory.getHandler('any.event.type')
			expect(handler).toBeNull()
		})

		it('should handle handler that supports no events', () => {
			class EmptyHandler implements IEventHandler {
				canHandle(): boolean {
					return false
				}
				async handle(): Promise<any> {
					return { success: true }
				}
			}

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			factory.registerHandlers([new EmptyHandler()])

			// Should not register any event types
			expect(factory.getRegisteredEventTypes()).toHaveLength(0)
			expect(consoleSpy).not.toHaveBeenCalled()

			consoleSpy.mockRestore()
		})
	})
})
