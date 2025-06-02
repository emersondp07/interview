import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import type { AuthenticateAdministratorSchema } from '@/domain/administrator/application/validators/authenticate-administrator.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateAdministrator(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateAdministratorSchema

	try {
		const { user } = await authenticateUseCase.execute({ email, password })

		const token = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sign: {
					sub: user.id,
				},
			},
		)

		const refreshToken = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sign: {
					sub: user.id,
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
