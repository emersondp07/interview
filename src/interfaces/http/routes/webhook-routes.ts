import type { FastifyTypedInstance } from '../../@types/instances.type'
import { gatewayPayment } from '../controllers/gateway-payment/gateway-payment'

export function webhookRoutes(app: FastifyTypedInstance) {
	app.post(
		'/webhook',
		{
			config: {
				rawBody: true,
			},
		},
		gatewayPayment,
	)
}
