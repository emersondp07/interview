import { FetchInterviewQuestionsUseCase } from '@/application/interview-question/fetch-interview-questions'
import type { FetchInterviewQuestionsSchema } from '@/application/interview-question/validators/fetch-interview-questions.schema'
import { PrismaInterviewQuestionsRepository } from '@/infra/database/repositories/prisma-interview-questions-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInterviewQuestions(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { page } = request.query as FetchInterviewQuestionsSchema

	const prismaInterviewQuestionsRepository = new PrismaInterviewQuestionsRepository()
	const fetchInterviewQuestionsUseCase = new FetchInterviewQuestionsUseCase(
		prismaInterviewQuestionsRepository,
	)

	const result = await fetchInterviewQuestionsUseCase.execute({ page })

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}