import { FetchInterviewsUseCase } from '@/domain/interviewer/application/use-cases/fetch-interviews'
import type { FetchInterviewsSchema } from '@/domain/interviewer/application/validators/fetch-interviews.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInterviews(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { page } = request.query as FetchInterviewsSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const fetchInterviewsUseCase = new FetchInterviewsUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await fetchInterviewsUseCase.execute({ page })

	return reply.status(200).send(value)
}
