import Stripe from 'stripe'
import { env } from '../../config'
import type { IStripeProducts } from './stripe-products'

export class StripeProductsService implements IStripeProducts {
	private stripe: Stripe

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			httpClient: Stripe.createFetchHttpClient(),
		})
	}

	createProduct(
		name: string,
		price: string,
		description: string,
	): Promise<Stripe.Product> {
		return this.stripe.products.create({
			name,
			description,
			default_price_data: {
				currency: 'brl',
				unit_amount: Number(price) * 100,
				recurring: {
					interval: 'month',
					interval_count: 1,
				},
			},
		})
	}

	getProduct(productId: string): Promise<Stripe.Product | null> {
		return this.stripe.products.retrieve(productId)
	}

	updateProduct(
		productId: string,
		name?: string,
		description?: string,
	): Promise<Stripe.Product> {
		return this.stripe.products.update(productId, {
			name,
			description,
		})
	}

	deleteProduct(productId: string): Promise<Stripe.DeletedProduct> {
		return this.stripe.products.del(productId)
	}
}
