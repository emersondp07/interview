import { FetchQuestionsByInterviewUseCase } from '@/application/interview-question/fetch-questions-by-interview'
import type { FetchQuestionsByInterviewParams } from '@/application/interview-question/validators/fetch-questions-by-interview.schema'
import { PrismaInterviewQuestionsRepository } from '@/infra/database/repositories/prisma-interview-questions-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchQuestionsByInterview(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.params as FetchQuestionsByInterviewParams

	const prismaInterviewQuestionsRepository = new PrismaInterviewQuestionsRepository()
	const fetchQuestionsByInterviewUseCase = new FetchQuestionsByInterviewUseCase(
		prismaInterviewQuestionsRepository,
	)

	const result = await fetchQuestionsByInterviewUseCase.execute({
		interviewId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}