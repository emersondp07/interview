import { CreateInterviewerUseCase } from '@/application/company/use-cases/create-interviewer'
import type { CreateInterviewerSchema } from '@/application/company/validators/create-interviewer.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInterviewersRepository } from '@/infra/database/repositories/prisma-interviewers-repository'
import { ResendEmailsService } from '@/infra/services/email/emails'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createInterviewer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user
	const {
		name,
		email,
		password,
		specialty,
		profissionalRegistration,
		numberRegistration,
		experience,
		bio,
	} = request.body as CreateInterviewerSchema

	const prismaInterviewersRepository = new PrismaInterviewersRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const resendEmailsService = new ResendEmailsService()
	const createInterviewerUseCase = new CreateInterviewerUseCase(
		prismaInterviewersRepository,
		prismaCompaniesRepository,
		resendEmailsService,
	)

	await createInterviewerUseCase.execute({
		name,
		email,
		password,
		specialty,
		profissionalRegistration,
		numberRegistration,
		experience,
		bio,
		companyId,
	})

	return reply.status(201).send()
}
