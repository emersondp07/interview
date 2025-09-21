import { UpdateInterviewQuestionUseCase } from '@/application/interview-question/update-interview-question'
import type { UpdateInterviewQuestionParams, UpdateInterviewQuestionSchema } from '@/application/interview-question/validators/update-interview-question.schema'
import { PrismaInterviewQuestionsRepository } from '@/infra/database/repositories/prisma-interview-questions-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateInterviewQuestion(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { questionId } = request.params as UpdateInterviewQuestionParams
	const { question, options, required } = request.body as UpdateInterviewQuestionSchema

	const prismaInterviewQuestionsRepository = new PrismaInterviewQuestionsRepository()
	const updateInterviewQuestionUseCase = new UpdateInterviewQuestionUseCase(
		prismaInterviewQuestionsRepository,
	)

	const result = await updateInterviewQuestionUseCase.execute({
		questionId,
		question,
		options,
		required,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}