import Stripe from 'stripe'
import { env } from '../../config'
import type { IStripeCustomers } from './stripe-customers'

export class StripeCustomersService implements IStripeCustomers {
	private stripe: Stripe

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			httpClient: Stripe.createFetchHttpClient(),
		})
	}

	createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
		return this.stripe.customers.create({
			email,
			name,
		})
	}

	createCheckoutSession(
		companyId: string,
		customerId: string,
		productId: string,
	): Promise<Stripe.Checkout.Session> {
		return this.stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ['card'],
			client_reference_id: companyId,
			line_items: [
				{
					price: productId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/cancel',
		})
	}

	async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
		const data = await this.stripe.customers.retrieve(customerId)

		if ('deleted' in data && data.deleted === true) {
			return null
		}

		return data
	}

	updateCustomer(
		customerId: string,
		email?: string,
		name?: string,
	): Promise<Stripe.Customer> {
		return this.stripe.customers.update(customerId, {
			email,
			name,
		})
	}

	deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
		return this.stripe.customers.del(customerId)
	}
}
