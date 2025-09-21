import { GenerateInterviewReportUseCase } from '@/application/interview-answer/generate-interview-report'
import type { GenerateInterviewReportParams } from '@/application/interview-answer/validators/generate-interview-report.schema'
import { PrismaInterviewAnswersRepository } from '@/infra/database/repositories/prisma-interview-answers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function generateInterviewReport(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.params as GenerateInterviewReportParams

	const prismaInterviewAnswersRepository = new PrismaInterviewAnswersRepository()
	const generateInterviewReportUseCase = new GenerateInterviewReportUseCase(
		prismaInterviewAnswersRepository,
	)

	const result = await generateInterviewReportUseCase.execute({
		interviewId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}