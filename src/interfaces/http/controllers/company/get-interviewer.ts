import { GetInterviewerByIdUseCase } from '@/application/company/use-cases/get-interviewer-by-id'
import type { GetInterviewerSchema } from '@/application/company/validators/get-interviewer-by-id.schema'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaCompaniesRepository } from '../../../../infra/database/repositories/prisma-companies-repository'

export async function getInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: userId, role } = request.user

	const { interviewerId } = request.params as GetInterviewerSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const fetchInterviewersUseCase = new GetInterviewerByIdUseCase(
		prismaInterviewersRepository,
		prismaCompaniesRepository,
	)

	const { value } = await fetchInterviewersUseCase.execute({
		userId,
		interviewerId,
		role,
	})

	return reply.status(200).send(value)
}
