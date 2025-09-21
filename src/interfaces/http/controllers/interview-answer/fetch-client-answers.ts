import { FetchClientAnswersUseCase } from '@/application/interview-answer/fetch-client-answers'
import type { FetchClientAnswersParams } from '@/application/interview-answer/validators/fetch-client-answers.schema'
import { PrismaInterviewAnswersRepository } from '@/infra/database/repositories/prisma-interview-answers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchClientAnswers(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.params as FetchClientAnswersParams

	const prismaInterviewAnswersRepository = new PrismaInterviewAnswersRepository()
	const fetchClientAnswersUseCase = new FetchClientAnswersUseCase(
		prismaInterviewAnswersRepository,
	)

	const result = await fetchClientAnswersUseCase.execute({
		clientId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}