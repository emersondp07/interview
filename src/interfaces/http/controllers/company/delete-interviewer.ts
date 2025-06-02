import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteInterviewerUseCase } from '../../../../domain/company/application/use-cases/delete-interviewer'
import type { DeleteInterviewerSchema } from '../../../../domain/company/application/validators/delete-interviewer.schema'
import { PrismaInterviewersRepository } from '../../../../infra/database/repositories/prisma-interviewers-repository'

export async function deleteInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { companyId, interviewerId } = request.body as DeleteInterviewerSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const deleteInterviewerUseCase = new DeleteInterviewerUseCase(
		prismaInterviewersRepository,
	)

	await deleteInterviewerUseCase.execute({
		companyId,
		interviewerId,
	})

	return reply.status(204).send()
}
