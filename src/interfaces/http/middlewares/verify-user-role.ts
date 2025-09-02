import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(rolesToVerify: ROLE[]) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user

		if (!rolesToVerify.includes(role)) {
			return reply.status(401).send({ message: 'Unauthorized.' })
		}
	}
}
