import { RegisterClientUseCase } from '@/domain/company/application/use-cases/register-client'
import type { RegisterClientSchema } from '@/domain/company/application/validators/register-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function registerClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { name, email, birthDate, phone, documentType, document, companyId } =
		request.body as RegisterClientSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const registerCompanyUseCase = new RegisterClientUseCase(
		prismaClientsRepository,
		prismaCompaniesRepository,
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
