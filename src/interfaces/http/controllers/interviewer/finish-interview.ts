import { FinishInterviewUseCase } from '@/domain/interviewer/application/use-cases/finish-interview'
import type { FinishInteviewSchema } from '@/domain/interviewer/application/validators/finish-interview.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function finishInterview(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.query as FinishInteviewSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const finishInterviewUseCase = new FinishInterviewUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await finishInterviewUseCase.execute({ interviewId })

	return reply.status(200).send(value)
}
