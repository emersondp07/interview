import { success } from '@/domain/core/either'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import { makeSignature } from '@/tests/factories/make-signature'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ActiveSignatureUseCase } from '../use-cases/active-signature'
import { CheckoutCompletedHandler } from './checkout-completed-handler'

// Mock do use case
const mockActiveSignatureUseCase = {
	execute: vi.fn(),
} as unknown as ActiveSignatureUseCase

describe('CheckoutCompletedHandler', () => {
	let handler: CheckoutCompletedHandler

	beforeEach(() => {
		vi.clearAllMocks()
		handler = new CheckoutCompletedHandler(mockActiveSignatureUseCase)
	})

	describe('canHandle', () => {
		it('should return true for checkout.session.completed event', () => {
			expect(handler.canHandle('checkout.session.completed')).toBe(true)
		})

		it('should return false for other event types', () => {
			expect(handler.canHandle('invoice.created')).toBe(false)
			expect(handler.canHandle('invoice.paid')).toBe(false)
			expect(handler.canHandle('price.created')).toBe(false)
			expect(handler.canHandle('unknown.event')).toBe(false)
		})
	})

	describe('handle', () => {
		const validEvent: WebhookEvent = {
			id: 'evt_test_123',
			type: 'checkout.session.completed',
			data: {
				object: {
					object: 'checkout.session',
					customer: 'cus_test_customer',
					subscription: 'sub_test_subscription',
					status: 'complete',
				},
			},
			created: 1234567890,
		}

		it('should handle valid checkout session completed event', async () => {
			vi.mocked(mockActiveSignatureUseCase.execute).mockResolvedValue(
				success({ signature: makeSignature() }),
			)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: true,
				message: 'Signature activated successfully',
				eventType: 'checkout.session.completed',
			})

			expect(mockActiveSignatureUseCase.execute).toHaveBeenCalledWith({
				companyId: 'cus_test_customer',
				subscriptionId: 'sub_test_subscription',
				stripeSubscriptionStatus: 'complete',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'✅ Signature activated successfully for customer: cus_test_customer',
			)

			consoleSpy.mockRestore()
		})

		it('should handle invalid event object type', async () => {
			const invalidEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						object: 'payment_intent', // Wrong object type
						customer: 'cus_test_customer',
					},
				},
			}

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const result = await handler.handle(invalidEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to activate signature',
				eventType: 'checkout.session.completed',
				error: 'Invalid event object: expected checkout.session',
			})

			expect(mockActiveSignatureUseCase.execute).not.toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling checkout completed:',
				expect.any(Error),
			)

			consoleErrorSpy.mockRestore()
		})

		it('should handle use case execution error', async () => {
			const useCaseError = new Error('Database connection failed')
			vi.mocked(mockActiveSignatureUseCase.execute).mockRejectedValue(
				useCaseError,
			)

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to activate signature',
				eventType: 'checkout.session.completed',
				error: 'Database connection failed',
			})

			expect(mockActiveSignatureUseCase.execute).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling checkout completed:',
				useCaseError,
			)

			consoleErrorSpy.mockRestore()
		})

		it('should handle missing session data', async () => {
			const incompleteEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						object: 'checkout.session',
						customer: 'cus_test_customer',
						// Missing subscription and status
					},
				},
			}

			vi.mocked(mockActiveSignatureUseCase.execute).mockResolvedValue(
				success({ signature: makeSignature() }),
			)

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(true)
			expect(mockActiveSignatureUseCase.execute).toHaveBeenCalledWith({
				companyId: 'cus_test_customer',
				subscriptionId: undefined,
				stripeSubscriptionStatus: undefined,
			})
		})

		it('should handle null/undefined event data gracefully', async () => {
			const nullDataEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: null as any,
				},
			}

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const result = await handler.handle(nullDataEvent)

			expect(result.success).toBe(false)
			expect(mockActiveSignatureUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})
	})
})
