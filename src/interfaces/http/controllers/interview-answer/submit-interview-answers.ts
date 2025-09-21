import { SubmitInterviewAnswersUseCase } from '@/application/interview-answer/submit-interview-answers'
import type { SubmitInterviewAnswersSchema } from '@/application/interview-answer/validators/submit-interview-answers.schema'
import { PrismaInterviewAnswersRepository } from '@/infra/database/repositories/prisma-interview-answers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function submitInterviewAnswers(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: clientId } = request.user
	const { answers } = request.body as SubmitInterviewAnswersSchema

	const prismaInterviewAnswersRepository = new PrismaInterviewAnswersRepository()
	const submitInterviewAnswersUseCase = new SubmitInterviewAnswersUseCase(
		prismaInterviewAnswersRepository,
	)

	const result = await submitInterviewAnswersUseCase.execute({
		clientId,
		answers,
	})

	return handleResult(result, reply, async () => {
		return reply.status(201).send()
	})
}