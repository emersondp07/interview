import type { FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest) {
	await request.jwtVerify()
}
