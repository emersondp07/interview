import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { AuthenticateCompanyUseCase } from '@/domain/company/application/use-cases/authenticate-company'
import type { AuthenticateCompanySchema } from '@/domain/company/application/validators/authenticate-client.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateCompany(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateCompanySchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const authenticateCompanyUseCase = new AuthenticateCompanyUseCase(
		prismaCompaniesRepository,
	)

	const { value } = await authenticateCompanyUseCase.execute({
		email,
		password,
	})

	if (value instanceof InvalidCredencialsError) {
		return reply.status(400).send({ message: value })
	}

	const token = await reply.jwtSign(
		{
			role: value.company.role,
		},
		{
			sign: {
				sub: value.company.id.toString(),
			},
		},
	)

	const refreshToken = await reply.jwtSign(
		{
			role: value.company.role,
		},
		{
			sign: {
				sub: value.company.id.toString(),
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
