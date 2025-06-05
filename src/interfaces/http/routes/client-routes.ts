import { authenticateClientSchema } from '@/domain/client/application/validators/authenticate-client.schema'
import type { FastifyInstance } from 'fastify'
import { authenticateClient } from '../controllers/client/authenticate-client'

export async function clientRoutes(app: FastifyInstance) {
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
