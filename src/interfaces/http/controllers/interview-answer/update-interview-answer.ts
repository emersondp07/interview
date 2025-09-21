import { UpdateInterviewAnswerUseCase } from '@/application/interview-answer/update-interview-answer'
import type { UpdateInterviewAnswerParams, UpdateInterviewAnswerSchema } from '@/application/interview-answer/validators/update-interview-answer.schema'
import { PrismaInterviewAnswersRepository } from '@/infra/database/repositories/prisma-interview-answers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateInterviewAnswer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { answerId } = request.params as UpdateInterviewAnswerParams
	const { selectedOption } = request.body as UpdateInterviewAnswerSchema

	const prismaInterviewAnswersRepository = new PrismaInterviewAnswersRepository()
	const updateInterviewAnswerUseCase = new UpdateInterviewAnswerUseCase(
		prismaInterviewAnswersRepository,
	)

	const result = await updateInterviewAnswerUseCase.execute({
		interviewAnswerId: answerId,
		selectedOption,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}