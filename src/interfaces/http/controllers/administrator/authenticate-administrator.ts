import { AuthenticateAdministratorUseCase } from '@/application/administrator/use-cases/authenticate-administrator'
import { PrismaAdministratorsRepository } from '@/infra/database/repositories/prisma-administrators-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { AuthenticateAdministratorSchema } from '@application/administrator/validators/authenticate-administrator.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateAdministrator(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateAdministratorSchema

	const prismaAdministratorRepository = new PrismaAdministratorsRepository()
	const authenticateAdministratorUseCase =
		new AuthenticateAdministratorUseCase(prismaAdministratorRepository)

	const result = await authenticateAdministratorUseCase.execute({
		email,
		password,
	})

	return handleResult(result, reply, async (value) => {
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
	})
}
