import { DeleteInterviewQuestionUseCase } from '@/application/interview-question/delete-interview-question'
import type { DeleteInterviewQuestionParams } from '@/application/interview-question/validators/delete-interview-question.schema'
import { PrismaInterviewQuestionsRepository } from '@/infra/database/repositories/prisma-interview-questions-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteInterviewQuestion(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { questionId } = request.params as DeleteInterviewQuestionParams

	const prismaInterviewQuestionsRepository = new PrismaInterviewQuestionsRepository()
	const deleteInterviewQuestionUseCase = new DeleteInterviewQuestionUseCase(
		prismaInterviewQuestionsRepository,
	)

	const result = await deleteInterviewQuestionUseCase.execute({
		questionId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}