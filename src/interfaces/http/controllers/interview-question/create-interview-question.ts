import { CreateInterviewQuestionUseCase } from '@/application/interview-question/create-interview-question'
import type { CreateInterviewQuestionSchema } from '@/application/interview-question/validators/create-interview-question.schema'
import { PrismaInterviewQuestionsRepository } from '@/infra/database/repositories/prisma-interview-questions-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createInterviewQuestion(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { question, options, required } = request.body as CreateInterviewQuestionSchema

	const prismaInterviewQuestionsRepository = new PrismaInterviewQuestionsRepository()
	const createInterviewQuestionUseCase = new CreateInterviewQuestionUseCase(
		prismaInterviewQuestionsRepository,
	)

	const result = await createInterviewQuestionUseCase.execute({
		question,
		options,
		required,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(201).send({ interviewQuestion: value.interviewQuestion })
	})
}