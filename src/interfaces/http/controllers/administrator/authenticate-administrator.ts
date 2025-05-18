import type { AuthenticateAdministratorSchema } from '@/domain/administrator/application/validators/authenticate-administrator.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateAdministrator(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateAdministratorSchema
}
