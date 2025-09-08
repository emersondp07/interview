import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterStripePriceHandler } from './register-stripe-price-handler'
import type { RegisterStripePriceIdUseCase } from '../use-cases/register-stripe-price-id'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'

// Mock do use case
const mockRegisterStripePriceIdUseCase = {
	execute: vi.fn(),
} as unknown as RegisterStripePriceIdUseCase

describe('RegisterStripePriceHandler', () => {
	let handler: RegisterStripePriceHandler

	beforeEach(() => {
		vi.clearAllMocks()
		handler = new RegisterStripePriceHandler(mockRegisterStripePriceIdUseCase)
	})

	describe('canHandle', () => {
		it('should return true for price.created event', () => {
			expect(handler.canHandle('price.created')).toBe(true)
		})

		it('should return false for other event types', () => {
			expect(handler.canHandle('checkout.session.completed')).toBe(false)
			expect(handler.canHandle('invoice.created')).toBe(false)
			expect(handler.canHandle('invoice.paid')).toBe(false)
			expect(handler.canHandle('unknown.event')).toBe(false)
		})
	})

	describe('handle', () => {
		const validEvent: WebhookEvent = {
			id: 'evt_test_123',
			type: 'price.created',
			data: {
				object: {
					id: 'price_test_12345',
					product: 'prod_test_product',
					currency: 'brl',
					unit_amount: 2990,
					recurring: {
						interval: 'month',
					},
				},
			},
			created: 1234567890,
		}

		it('should handle valid price created event', async () => {
			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: true,
				message: 'Stripe price registered successfully',
				eventType: 'price.created',
			})

			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: 'prod_test_product',
				priceId: 'price_test_12345',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'✅ Stripe price registered successfully: price_test_12345 for product: prod_test_product',
			)

			consoleSpy.mockRestore()
		})

		it('should handle use case execution error', async () => {
			const useCaseError = new Error('Database connection failed')
			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockRejectedValue(useCaseError)

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to register stripe price',
				eventType: 'price.created',
				error: 'Database connection failed',
			})

			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling price registration:',
				useCaseError,
			)

			consoleErrorSpy.mockRestore()
		})

		it('should handle missing product data', async () => {
			const incompleteEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'price_test_12345',
						currency: 'brl',
						// Missing product
					},
				},
			}

			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(true)
			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: undefined,
				priceId: 'price_test_12345',
			})
		})

		it('should handle missing price id', async () => {
			const incompleteEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						product: 'prod_test_product',
						currency: 'brl',
						// Missing id
					},
				},
			}

			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(true)
			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: 'prod_test_product',
				priceId: undefined,
			})
		})

		it('should handle product as null', async () => {
			const nullProductEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'price_test_12345',
						product: null,
						currency: 'brl',
					},
				},
			}

			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(nullProductEvent)

			expect(result.success).toBe(true)
			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: null,
				priceId: 'price_test_12345',
			})
		})

		it('should handle different price types (one-time vs recurring)', async () => {
			const oneTimeEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'price_test_12345',
						product: 'prod_test_product',
						currency: 'brl',
						unit_amount: 2990,
						// No recurring field - one-time payment
					},
				},
			}

			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(oneTimeEvent)

			expect(result.success).toBe(true)
			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: 'prod_test_product',
				priceId: 'price_test_12345',
			})
		})

		it('should handle null/undefined event data gracefully', async () => {
			const nullDataEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: null as any,
				},
			}

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(nullDataEvent)

			expect(result.success).toBe(false)
			expect(mockRegisterStripePriceIdUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})

		it('should handle empty event data object', async () => {
			const emptyDataEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {},
				},
			}

			vi.mocked(mockRegisterStripePriceIdUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(emptyDataEvent)

			expect(result.success).toBe(true)
			expect(mockRegisterStripePriceIdUseCase.execute).toHaveBeenCalledWith({
				productId: undefined,
				priceId: undefined,
			})
		})
	})
})