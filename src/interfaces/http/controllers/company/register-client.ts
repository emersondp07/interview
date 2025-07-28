import { RegisterClientUseCase } from '@/application/company/use-cases/register-client'
import type { RegisterClientSchema } from '@/application/company/validators/register-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import { ResendEmailsService } from '@/infra/services/email/emails'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function registerClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user
	const { name, email, birthDate, phone, documentType, document } =
		request.body as RegisterClientSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const resendEmailsService = new ResendEmailsService()
	const registerCompanyUseCase = new RegisterClientUseCase(
		prismaClientsRepository,
		prismaCompaniesRepository,
		prismaInterviewsRepository,
		resendEmailsService,
	)

	await registerCompanyUseCase.execute({
		name,
		email,
		birthDate,
		phone,
		documentType,
		document,
		companyId,
	})

	return reply.status(201).send()
}
