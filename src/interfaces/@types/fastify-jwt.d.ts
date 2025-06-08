import '@fastify/jwt'
import type { ROLE } from '../../domain/administrator/enterprise/entities/interfaces/adminitrator.type'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: {
			sub: string
			role: ROLE
		}
	}
}
