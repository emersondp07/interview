import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { AuthenticateClientUseCase } from '@/domain/client/application/use-cases/authenticate-client'
import type { AuthenticateClientSchema } from '@/domain/client/application/validators/authenticate-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
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
		return reply.status(400).send({ message: value })
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
