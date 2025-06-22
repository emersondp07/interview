import type Stripe from 'stripe'

export interface IStripeCustomers {
	createCustomer(email: string, name?: string): Promise<Stripe.Customer>
	getCustomer(customerId: string): Promise<Stripe.Customer | null>
	updateCustomer(
		customerId: string,
		email?: string,
		name?: string,
	): Promise<Stripe.Customer>
	deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer>
	createCheckoutSession(
		companyId: string,
		customerId: string,
		productId: string,
	): Promise<Stripe.Checkout.Session>
}
