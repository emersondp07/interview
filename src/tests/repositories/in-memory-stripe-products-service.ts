import type { IStripeProducts } from '@/infra/services/stripe/interfaces/stripe-products'
import type Stripe from 'stripe'

export class InMemoryStripeProductsService implements IStripeProducts {
	public items: Stripe.Product[] = []

	createProduct(name: string, price: string, description: string) {
		const product = {
			id: `prod_${Math.random().toString(36).substring(2, 15)}`,
			name,
			description,
			active: true,
			created: Math.floor(Date.now() / 1000),
			object: 'product',
			livemode: false,
			metadata: {},
			default_price: null,
			images: [],
			package_dimensions: null,
			shippable: false,
			tax_code: null,
			unit_label: null,
			url: null,
		} as unknown as Stripe.Product

		this.items.push(product)

		return Promise.resolve(product)
	}

	getProduct(productId: string) {
		const product = this.items.find((product) => product.id === productId)
		if (!product) {
			return Promise.resolve(null)
		}
		return Promise.resolve(product)
	}
	updateProduct(
		productId: string,
		name?: string,
		description?: string,
		active?: boolean,
	) {
		const productIndex = this.items.findIndex(
			(product) => product.id === productId,
		)

		if (productIndex === -1) {
			throw new Error('Product not found')
		}

		const updatedProduct: Stripe.Product = {
			...this.items[productIndex],
			name: name ?? this.items[productIndex].name,
			description: description ?? this.items[productIndex].description,
			active: active ?? this.items[productIndex].active,
		}

		this.items[productIndex] = updatedProduct

		return Promise.resolve(updatedProduct)
	}

	deleteProduct(productId: string) {
		const productIndex = this.items.findIndex(
			(product) => product.id === productId,
		)

		if (productIndex === -1) {
			throw new Error('Product not found')
		}

		const deletedProduct = this.items[productIndex]
		this.items.splice(productIndex, 1)
		return Promise.resolve({
			id: deletedProduct.id,
			object: 'deleted_product',
			deleted: true,
		} as unknown as Stripe.DeletedProduct)
	}
}
