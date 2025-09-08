import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateInvoiceHandler } from './create-invoice-handler'
import type { CreateInvoiceUseCase } from '../use-cases/create-invoice'
import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'

// Mock do use case
const mockCreateInvoiceUseCase = {
	execute: vi.fn(),
} as unknown as CreateInvoiceUseCase

describe('CreateInvoiceHandler', () => {
	let handler: CreateInvoiceHandler

	beforeEach(() => {
		vi.clearAllMocks()
		handler = new CreateInvoiceHandler(mockCreateInvoiceUseCase)
	})

	describe('canHandle', () => {
		it('should return true for invoice.created event', () => {
			expect(handler.canHandle('invoice.created')).toBe(true)
		})

		it('should return false for other event types', () => {
			expect(handler.canHandle('checkout.session.completed')).toBe(false)
			expect(handler.canHandle('invoice.paid')).toBe(false)
			expect(handler.canHandle('price.created')).toBe(false)
			expect(handler.canHandle('unknown.event')).toBe(false)
		})
	})

	describe('handle', () => {
		const validEvent: WebhookEvent = {
			id: 'evt_test_123',
			type: 'invoice.created',
			data: {
				object: {
					id: 'in_test_invoice',
					customer: 'cus_test_customer',
					amount_paid: 2990, // $29.90 in cents
					lines: {
						data: [
							{
								period: {
									start: 1672531200, // January 2023
								},
							},
						],
					},
				},
			},
			created: 1234567890,
		}

		it('should handle valid invoice created event', async () => {
			vi.mocked(mockCreateInvoiceUseCase.execute).mockResolvedValue(undefined)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: true,
				message: 'Invoice created successfully',
				eventType: 'invoice.created',
			})

			expect(mockCreateInvoiceUseCase.execute).toHaveBeenCalledWith({
				mounth: '1672531200',
				value: '2990',
				companyId: 'cus_test_customer',
				stripeInvoiceId: 'in_test_invoice',
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'✅ Invoice created successfully: in_test_invoice for customer: cus_test_customer',
			)

			consoleSpy.mockRestore()
		})

		it('should handle use case execution error', async () => {
			const useCaseError = new Error('Database connection failed')
			vi.mocked(mockCreateInvoiceUseCase.execute).mockRejectedValue(useCaseError)

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to create invoice',
				eventType: 'invoice.created',
				error: 'Database connection failed',
			})

			expect(mockCreateInvoiceUseCase.execute).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling invoice creation:',
				useCaseError,
			)

			consoleErrorSpy.mockRestore()
		})

		it('should handle missing invoice data gracefully', async () => {
			const incompleteEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'in_test_invoice',
						customer: 'cus_test_customer',
						// Missing amount_paid and lines
					},
				},
			}

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(false)
			expect(mockCreateInvoiceUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})

		it('should handle zero amount invoice', async () => {
			const zeroAmountEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						...validEvent.data.object,
						amount_paid: 0,
					},
				},
			}

			vi.mocked(mockCreateInvoiceUseCase.execute).mockResolvedValue(undefined)

			const result = await handler.handle(zeroAmountEvent)

			expect(result.success).toBe(true)
			expect(mockCreateInvoiceUseCase.execute).toHaveBeenCalledWith({
				mounth: '1672531200',
				value: '0',
				companyId: 'cus_test_customer',
				stripeInvoiceId: 'in_test_invoice',
			})
		})

		it('should handle missing lines data', async () => {
			const noLinesEvent: WebhookEvent = {
				...validEvent,
				data: {
					object: {
						id: 'in_test_invoice',
						customer: 'cus_test_customer',
						amount_paid: 2990,
						lines: {
							data: [], // Empty lines array
						},
					},
				},
			}

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const result = await handler.handle(noLinesEvent)

			expect(result.success).toBe(false)
			expect(mockCreateInvoiceUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
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
			expect(mockCreateInvoiceUseCase.execute).not.toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})
	})
})