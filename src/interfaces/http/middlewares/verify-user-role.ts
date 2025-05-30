import type { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: ROLE) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user

		if (role !== roleToVerify) {
			return reply.status(401).send({ message: 'Unauthorized.' })
		}
	}
}
