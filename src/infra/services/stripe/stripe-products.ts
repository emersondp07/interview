import type Stripe from 'stripe'

export interface IStripeProducts {
	createProduct(
		name: string,
		price: string,
		description: string,
	): Promise<Stripe.Product>
	getProduct(productId: string): Promise<Stripe.Product | null>
	updateProduct(
		productId: string,
		name?: string,
		description?: string,
		active?: boolean,
	): Promise<Stripe.Product>
	deleteProduct(productId: string): Promise<Stripe.DeletedProduct>
}
