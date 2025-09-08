import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PaidInvoiceHandler } from './paid-invoice-handler'
import type { PaidInvoiceUseCase } from '../use-cases/paid-invoice'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'

// Mock do use case
const mockPaidInvoiceUseCase = {
	execute: vi.fn(),
} as unknown as PaidInvoiceUseCase

describe('PaidInvoiceHandler', () => {
	let handler: PaidInvoiceHandler

	beforeEach(() => {
		vi.clearAllMocks()
		handler = new PaidInvoiceHandler(mockPaidInvoiceUseCase)
	})

	describe('canHandle', () => {
		it('should return true for invoice.paid event', () => {
			expect(handler.canHandle('invoice.paid')).toBe(true)
		})

		it('should return false for other event types', () => {
			expect(handler.canHandle('checkout.session.completed')).toBe(false)
			expect(handler.canHandle('invoice.created')).toBe(false)
			expect(handler.canHandle('price.created')).toBe(false)
			expect(handler.canHandle('unknown.event')).toBe(false)
		})
	})

	describe('handle', () => {
		const validEvent: WebhookEvent = {
			id: 'evt_test_123',
			type: 'invoice.paid',
			data: {
				object: {
					id: 'in_test_invoice',
					customer: 'cus_test_customer',
					status: 'paid',
					amount_paid: 2990,
				},
			},
			created: 1234567890,
		}

		it('should handle valid invoice paid event', async () => {
			vi.mocked(mockPaidInvoiceUseCase.execute).mockResolvedValue(undefined)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: true,
				message: 'Invoice paid successfully',
				eventType: 'invoice.paid',
			})

			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalledWith({
				customerId: 'cus_test_customer',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'✅ Invoice paid successfully for customer: cus_test_customer',
			)

			consoleSpy.mockRestore()
		})

		it('should handle use case execution error', async () => {
			const useCaseError = new Error('Database connection failed')
			vi.mocked(mockPaidInvoiceUseCase.execute).mockRejectedValue(useCaseError)

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to process invoice payment',
				eventType: 'invoice.paid',
				error: 'Database connection failed',
			})

			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling invoice payment:',
				useCaseError,
			)

			consoleErrorSpy.mockRestore()
		})

		it('should handle missing customer data', async () => {
			const incompleteEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'in_test_invoice',
						status: 'paid',
						// Missing customer
					},
				},
			}

			vi.mocked(mockPaidInvoiceUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(true)
			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalledWith({
				customerId: undefined,
			})
		})

		it('should handle customer as null', async () => {
			const nullCustomerEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'in_test_invoice',
						customer: null,
						status: 'paid',
					},
				},
			}

			vi.mocked(mockPaidInvoiceUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(nullCustomerEvent)

			expect(result.success).toBe(true)
			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalledWith({
				customerId: null,
			})
		})

		it('should handle different invoice statuses', async () => {
			const differentStatusEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'in_test_invoice',
						customer: 'cus_test_customer',
						status: 'open', // Different status
					},
				},
			}

			vi.mocked(mockPaidInvoiceUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(differentStatusEvent)

			expect(result.success).toBe(true)
			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalledWith({
				customerId: 'cus_test_customer',
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
			expect(mockPaidInvoiceUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})

		it('should handle empty event data object', async () => {
			const emptyDataEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {},
				},
			}

			vi.mocked(mockPaidInvoiceUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(emptyDataEvent)

			expect(result.success).toBe(true)
			expect(mockPaidInvoiceUseCase.execute).toHaveBeenCalledWith({
				customerId: undefined,
			})
		})
	})
})