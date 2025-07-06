import { AuthenticateClientUseCase } from '@/application/client/use-cases/authenticate-client'
import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { AuthenticateClientSchema } from '@application/client/validators/authenticate-client.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { document } = request.body as AuthenticateClientSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const authenticateClientUseCase = new AuthenticateClientUseCase(
		prismaClientsRepository,
	)

	const { value } = await authenticateClientUseCase.execute({
		document,
	})

	if (value instanceof InvalidCredencialsError) {
		return reply.status(401).send(value)
	}

	const token = await reply.jwtSign(
		{
			role: value.client.role,
		},
		{
			sign: {
				sub: value.client.id.toString(),
			},
		},
	)

	const refreshToken = await reply.jwtSign(
		{
			role: value.client.role,
		},
		{
			sign: {
				sub: value.client.id.toString(),
				expiresIn: '7d',
			},
		},
	)

	return reply
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			secure: true,
			sameSite: true,
			httpOnly: true,
		})
		.status(200)
		.send({
			token,
		})
}
