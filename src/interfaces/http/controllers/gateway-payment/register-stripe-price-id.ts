import { RegisterStripePriceIdUseCase } from '@/application/gateway-payment/use-cases/register-stripe-price-id'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import type Stripe from 'stripe'

export async function registerStripePriceId(event: Stripe.PriceCreatedEvent) {
	const { product, id } = event.data.object as Stripe.Price

	const prismaPlansRepository = new PrismaPlansRepository()
	const registerStripePriceIdUseCase = new RegisterStripePriceIdUseCase(
		prismaPlansRepository,
	)

	await registerStripePriceIdUseCase.execute({
		productId: product as string,
		priceId: id,
	})

	return {
		status: 'success',
		message: 'Stripe price ID registered successfully',
	}
}
