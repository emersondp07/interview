import type { WebhookEvent } from '@/infra/services/stripe/interfaces/stripe-webhooks'
import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterStripePriceIdUseCase } from '../use-cases/register-stripe-price-id'
import { RegisterStripePriceHandler } from './register-stripe-price-handler'

let inMemoryPlansRepository: InMemoryPlansRepository
let registerStripePriceIdUseCase: RegisterStripePriceIdUseCase
let handler: RegisterStripePriceHandler

describe('RegisterStripePriceHandler', () => {
	beforeEach(() => {
		inMemoryPlansRepository = new InMemoryPlansRepository()
		registerStripePriceIdUseCase = new RegisterStripePriceIdUseCase(
			inMemoryPlansRepository,
		)
		handler = new RegisterStripePriceHandler(registerStripePriceIdUseCase)
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
			// Criar um plano no repositório in-memory
			const plan = makePlan({ stripeProductId: 'prod_test_product' })
			await inMemoryPlansRepository.create(plan)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: true,
				message: 'Stripe price registered successfully',
				eventType: 'price.created',
			})

			// Verificar se o plano foi atualizado com o priceId
			const updatedPlan =
				await inMemoryPlansRepository.findByProductId('prod_test_product')
			expect(updatedPlan?.stripePriceId).toBe('price_test_12345')

			expect(consoleSpy).toHaveBeenCalledWith(
				'✅ Stripe price registered successfully: price_test_12345 for product: prod_test_product',
			)

			consoleSpy.mockRestore()
		})

		it('should handle use case execution error when plan not found', async () => {
			// Não criar plano no repositório para forçar erro
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const result = await handler.handle(validEvent)

			expect(result).toEqual({
				success: false,
				message: 'Failed to register stripe price',
				eventType: 'price.created',
				error: 'Plan not found',
			})

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'❌ Error handling price registration:',
				expect.any(Error),
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

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			const result = await handler.handle(incompleteEvent)

			// Deve falhar porque productId é undefined e não há plano para buscar
			expect(result.success).toBe(false)
			expect(result.error).toBe('Plan not found')

			consoleErrorSpy.mockRestore()
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

			// Criar plano no repositório
			const plan = makePlan({ stripeProductId: 'prod_test_product' })
			await inMemoryPlansRepository.create(plan)

			const result = await handler.handle(incompleteEvent)

			expect(result.success).toBe(true)
			// Verificar se o plano foi atualizado mesmo com priceId undefined
			const updatedPlan =
				await inMemoryPlansRepository.findByProductId('prod_test_product')
			expect(updatedPlan?.stripePriceId).toBeUndefined()
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

			consoleErrorSpy.mockRestore()
		})
	})
})
