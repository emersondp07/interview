import { RegisterCompanyUseCase } from '@/domain/administrator/application/use-cases/register-company'
import type { RegisterCompanySchema } from '@/domain/administrator/application/validators/register-company.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaCompaniesRepository } from '../../../../infra/database/repositories/prisma-companies-repository'
import { PrismaPlansRepository } from '../../../../infra/database/repositories/prisma-plans-repository'
import { PrismaSignaturesRepository } from '../../../../infra/database/repositories/prisma-signatures-repository'

export async function registerCompany(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { corporateReason, cnpj, email, password, phone, planId } =
		request.body as RegisterCompanySchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const prismaPlansRepository = new PrismaPlansRepository()
	const prismaSignaturesRepository = new PrismaSignaturesRepository()
	const registerCompanyUseCase = new RegisterCompanyUseCase(
		prismaCompaniesRepository,
		prismaPlansRepository,
		prismaSignaturesRepository,
	)

	await registerCompanyUseCase.execute({
		corporateReason,
		cnpj,
		email,
		password,
		phone,
		planId,
	})

	return reply.status(201).send()
}
