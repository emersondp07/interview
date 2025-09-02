import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetInterviewSchema } from '@/application/client/validators/get-interview.schema'
import { GetInterviewByIdUseCase } from '@/application/interviewer/use-cases/get-interview'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'

export async function getInterview(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	// const { sub: companyId } = request.user

	const { interviewId } = request.params as GetInterviewSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const getInterviewersUseCase = new GetInterviewByIdUseCase(
		prismaInterviewsRepository,
	)

	const result = await getInterviewersUseCase.execute({
		interviewId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}
