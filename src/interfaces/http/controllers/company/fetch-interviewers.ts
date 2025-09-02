import { FetchInterviewersUseCase } from '@/application/company/use-cases/fetch-interviewers'
import type { FetchInterviewersSchema } from '@/application/company/validators/fetch-interviewers.schema'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInterviewers(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user

	const { page } = request.query as FetchInterviewersSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const fetchInterviewersUseCase = new FetchInterviewersUseCase(
		prismaInterviewersRepository,
	)

	const result = await fetchInterviewersUseCase.execute({ companyId, page })

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}
