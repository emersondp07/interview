import { FetchAnswersByInterviewUseCase } from '@/application/interview-answer/fetch-answers-by-interview'
import type { FetchAnswersByInterviewParams } from '@/application/interview-answer/validators/fetch-answers-by-interview.schema'
import { PrismaInterviewAnswersRepository } from '@/infra/database/repositories/prisma-interview-answers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchAnswersByInterview(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.params as FetchAnswersByInterviewParams

	const prismaInterviewAnswersRepository = new PrismaInterviewAnswersRepository()
	const fetchAnswersByInterviewUseCase = new FetchAnswersByInterviewUseCase(
		prismaInterviewAnswersRepository,
	)

	const result = await fetchAnswersByInterviewUseCase.execute({
		interviewId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}