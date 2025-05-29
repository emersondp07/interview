import { SendContractUseCase } from '@/domain/interviewer/application/use-cases/send-contract'
import type { SendContractSchema } from '@/domain/interviewer/application/validators/send-contract.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function sendContract(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { interviewId } = request.query as SendContractSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const sendContractUseCase = new SendContractUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await sendContractUseCase.execute({ interviewId })

	return reply.status(200).send(value)
}
