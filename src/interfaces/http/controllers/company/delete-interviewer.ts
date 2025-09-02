import { DeleteInterviewerUseCase } from '@/application/company/use-cases/delete-interviewer'
import type { DeleteInterviewerParams } from '@/application/company/validators/delete-interviewer.schema'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user
	const { interviewerId } = request.params as DeleteInterviewerParams

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const deleteInterviewerUseCase = new DeleteInterviewerUseCase(
		prismaInterviewersRepository,
	)

	const result = await deleteInterviewerUseCase.execute({
		interviewerId,
		companyId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}
