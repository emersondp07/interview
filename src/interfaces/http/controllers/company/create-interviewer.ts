import { CreateInterviewerUseCase } from '@/domain/company/application/use-cases/create-interviewer'
import type { CreateInterviewerSchema } from '@/domain/company/application/validators/create-interviewer.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { name, email, password, companyId } =
		request.body as CreateInterviewerSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const createInterviewerUseCase = new CreateInterviewerUseCase(
		prismaInterviewersRepository,
		prismaCompaniesRepository,
	)

	await createInterviewerUseCase.execute({
		name,
		email,
		password,
		companyId,
	})

	return reply.status(201).send()
}
