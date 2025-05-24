import { FetchInterviewersUseCase } from '@/domain/company/application/use-cases/fetch-interviewers'
import type { FetchInterviewersSchema } from '@/domain/company/application/validators/fetch-interviewers.schema'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInterviewers(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { page } = request.query as FetchInterviewersSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const fetchInterviewersUseCase = new FetchInterviewersUseCase(
		prismaInterviewersRepository,
	)

	const { value } = await fetchInterviewersUseCase.execute({ page })

	return reply.status(200).send(value)
}
