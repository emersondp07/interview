import { env } from '@/infra/config'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'
import { StripeWebhooksService } from './webhooks'

// Mock do Stripe
vi.mock('stripe')

describe('StripeWebhooksService', () => {
	let stripeWebhooksService: StripeWebhooksService
	let mockStripe: any

	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks()

		// Mock da instância do Stripe
		mockStripe = {
			webhooks: {
				constructEvent: vi.fn(),
			},
		}

		// Mock do constructor do Stripe
		vi.mocked(Stripe).mockImplementation(() => mockStripe)

		stripeWebhooksService = new StripeWebhooksService()
	})

	describe('validateEvent', () => {
		it('should validate and return webhook event successfully', async () => {
			const mockEvent = {
				id: 'evt_test_123',
				type: 'checkout.session.completed',
				data: { object: { id: 'cs_test_123' } },
				created: 1234567890,
			}

			mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)

			const result = await stripeWebhooksService.validateEvent(
				'raw_body',
				'signature',
			)

			expect(result).toEqual({
				id: 'evt_test_123',
				type: 'checkout.session.completed',
				data: { object: { id: 'cs_test_123' } },
				created: 1234567890,
			})

			expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
				'raw_body',
				'signature',
				env.STRIPE_WEBHOOK_SECRET_KEY,
			)
		})

		it('should throw error when webhook validation fails', async () => {
			const mockError = new Error('Invalid signature')
			mockStripe.webhooks.constructEvent.mockImplementation(() => {
				throw mockError
			})

			await expect(
				stripeWebhooksService.validateEvent('raw_body', 'invalid_signature'),
			).rejects.toThrow('Webhook validation failed: Invalid signature')
		})
	})

	describe('constructEvent', () => {
		it('should construct stripe event successfully', async () => {
			const mockEvent = {
				id: 'evt_test_123',
				type: 'invoice.paid',
			}

			mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)

			const result = await stripeWebhooksService.constructEvent(
				'raw_body',
				'signature',
			)

			expect(result).toEqual(mockEvent)
			expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
				'raw_body',
				'signature',
				env.STRIPE_WEBHOOK_SECRET_KEY,
			)
		})
	})

	describe('getSupportedEventTypes', () => {
		it('should return list of supported event types', () => {
			const supportedTypes = stripeWebhooksService.getSupportedEventTypes()

			expect(supportedTypes).toEqual([
				'price.created',
				'checkout.session.completed',
				'payment_intent.succeeded',
				'payment_intent.payment_failed',
				'invoice.created',
				'invoice.paid',
				'invoice.payment_failed',
			])
		})

		it('should include all expected event types', () => {
			const supportedTypes = stripeWebhooksService.getSupportedEventTypes()

			expect(supportedTypes).toContain('price.created')
			expect(supportedTypes).toContain('checkout.session.completed')
			expect(supportedTypes).toContain('invoice.created')
			expect(supportedTypes).toContain('invoice.paid')
		})
	})
})