import { StartInterviewUseCase } from '@/domain/interviewer/application/use-cases/start-interview'
import type { StartInterviewSchema } from '@/domain/interviewer/application/validators/start-interview.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function startInterview(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.query as StartInterviewSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const startInterviewUseCase = new StartInterviewUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await startInterviewUseCase.execute({ interviewId })

	return reply.status(200).send(value)
}
