import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { AuthenticateAdministratorUseCase } from '@/domain/administrator/application/use-cases/authenticate-administrator'
import type { AuthenticateAdministratorSchema } from '@/domain/administrator/application/validators/authenticate-administrator.schema'
import { PrismaAdministratorsRepository } from '@/infra/database/repositories/prisma-administrators-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateAdministrator(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateAdministratorSchema

	try {
		const prismaAdministratorRepository = new PrismaAdministratorsRepository()
		const authenticateAdministratorUseCase =
			new AuthenticateAdministratorUseCase(prismaAdministratorRepository)

		const { value } = await authenticateAdministratorUseCase.execute({
			email,
			password,
		})

		if (value instanceof InvalidCredencialsError) {
			return value
		}

		const token = await reply.jwtSign(
			{
				role: value.administrator.role,
			},
			{
				sign: {
					sub: value.administrator.id.toString(),
				},
			},
		)

		const refreshToken = await reply.jwtSign(
			{
				role: value.administrator.role,
			},
			{
				sign: {
					sub: value.administrator.id.toString(),
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
	} catch (err) {
		if (err instanceof InvalidCredencialsError) {
			return reply.status(400).send({ message: err.message })
		}

		throw err
	}
}
