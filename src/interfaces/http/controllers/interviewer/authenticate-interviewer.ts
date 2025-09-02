import { AuthenticateInterviewerUseCase } from '@/application/interviewer/use-cases/authenticate-interviewer'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { AuthenticateInterviewerSchema } from '@application/interviewer/validators/authenticate-interviewer.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = request.body as AuthenticateInterviewerSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const authenticateInterviewerUseCase = new AuthenticateInterviewerUseCase(
		prismaInterviewersRepository,
	)

	const result = await authenticateInterviewerUseCase.execute({
		email,
		password,
	})

	return handleResult(result, reply, async (value) => {
		const token = await reply.jwtSign(
			{
				role: value.interviewer.role,
			},
			{
				sign: {
					sub: value.interviewer.id.toString(),
				},
			},
		)

		const refreshToken = await reply.jwtSign(
			{
				role: value.interviewer.role,
			},
			{
				sign: {
					sub: value.interviewer.id.toString(),
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
