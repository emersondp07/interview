import { faker } from '@faker-js/faker'

export function makeStripePriceCreatedEvent(
	overrides?: Partial<Record<string, any>>,
) {
	const created = overrides?.created ?? Math.floor(Date.now() / 1000)

	return {
		id: overrides?.id ?? `evt_${faker.string.alphanumeric(14)}`,
		object: 'event',
		api_version: '2025-05-28.basil',
		created,
		data: {
			object: {
				id: overrides?.priceId ?? `price_${faker.string.alphanumeric(14)}`,
				object: 'price',
				active: true,
				billing_scheme: 'per_unit',
				created,
				currency: 'brl',
				custom_unit_amount: null,
				livemode: false,
				lookup_key: null,
				metadata: {},
				nickname: null,
				product:
					overrides?.productId ?? `prod_${faker.string.alphanumeric(14)}`,
				recurring: {
					interval: 'month',
					interval_count: 1,
					usage_type: 'licensed',
				},
				tax_behavior: 'unspecified',
				tiers_mode: null,
				transform_quantity: null,
				type: 'recurring',
				unit_amount: 3990,
				unit_amount_decimal: '3990',
			},
		},
		livemode: false,
		pending_webhooks: 2,
		request: {
			id: `req_${faker.string.alphanumeric(14)}`,
			idempotency_key: `stripe-node-retry-${faker.string.uuid()}`,
		},
		type: 'price.created',
	}
}
