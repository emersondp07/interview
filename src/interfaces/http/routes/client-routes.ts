import { authenticateClientSchema } from '@/domain/client/application/validators/authenticate-client.schema'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { authenticateClient } from '../controllers/client/authenticate-client'

export async function clientRoutes(app: FastifyTypedInstance) {
	app.post(
		'/session-client',
		{
			schema: {
				tags: ['Client'],
				summary: '',
				description: '',
				body: authenticateClientSchema,
			},
		},
		authenticateClient,
	)
}
