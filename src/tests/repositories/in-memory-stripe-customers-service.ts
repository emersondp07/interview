import type { IStripeCustomers } from '@/infra/services/stripe/interfaces/stripe-customers'
import type Stripe from 'stripe'

export class InMemoryStripeCustomersService implements IStripeCustomers {
	public items: Stripe.Customer[] = []

	async createCustomer(email: string, name?: string) {
		const customer: Stripe.Customer = {
			id: `cus_${Math.random().toString(36).substring(2, 15)}`,
			email,
			name,
			created: Math.floor(Date.now() / 1000),
			object: 'customer',
			livemode: false,
			metadata: {},
			description: '',
			default_source: null,
			delinquent: false,
			discount: null,
			shipping: null,
			tax_exempt: 'none',
			...({} as any),
		}

		this.items.push(customer)

		return customer
	}

	async createCheckoutSession(
		companyId: string,
		customerId: string,
		productId: string,
	) {
		const session = {
			id: `cs_${Math.random().toString(36).substring(2, 15)}`,
			object: 'checkout.session',
			customer: customerId,
			client_reference_id: companyId,
			payment_status: 'unpaid',
			mode: 'subscription',
			success_url: 'https://example.com/success',
			cancel_url: 'https://example.com/cancel',
			line_items: [
				{
					price: productId,
					quantity: 1,
				},
			],
			created: Math.floor(Date.now() / 1000),
		}

		return session as unknown as Stripe.Checkout.Session
	}

	async getCustomer(customerId: string) {
		const customer = this.items.find((customer) => customer.id === customerId)

		if (!customer) {
			return null
		}

		return customer
	}

	async updateCustomer(customerId: string, email?: string, name?: string) {
		const customerIndex = this.items.findIndex(
			(customer) => customer.id === customerId,
		)

		if (customerIndex === -1) {
			return Promise.reject(new Error('Customer not found'))
		}

		const customer = this.items[customerIndex]
		if (email) {
			customer.email = email
		}

		if (name) {
			customer.name = name
		}

		this.items[customerIndex] = customer
		return customer
	}

	async deleteCustomer(customerId: string) {
		const customerIndex = this.items.findIndex(
			(customer) => customer.id === customerId,
		)

		if (customerIndex === -1) {
			return Promise.reject(new Error('Customer not found'))
		}

		this.items.splice(customerIndex, 1)
	}
}
