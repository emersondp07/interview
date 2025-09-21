import { RegisterCompanyUseCase } from '@/application/administrator/use-cases/register-company'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaPlansRepository } from '@/infra/database/repositories/prisma-plans-repository'
import { PrismaSignaturesRepository } from '@/infra/database/repositories/prisma-signatures-repository'
import { ResendEmailsService } from '@/infra/services/email/emails'
import { StripeCustomersService } from '@/infra/services/stripe/customers'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { RegisterCompanySchema } from '@application/administrator/validators/register-company.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function registerCompany(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { corporateReason, cnpj, email, password, phone, planId } =
		request.body as RegisterCompanySchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const prismaPlansRepository = new PrismaPlansRepository()
	const prismaSignaturesRepository = new PrismaSignaturesRepository()
	const stripeCustomersService = new StripeCustomersService()
	const resendEmailsService = new ResendEmailsService()
	const registerCompanyUseCase = new RegisterCompanyUseCase(
		prismaCompaniesRepository,
		prismaPlansRepository,
		prismaSignaturesRepository,
		stripeCustomersService,
		resendEmailsService,
	)

	const result = await registerCompanyUseCase.execute({
		corporateReason,
		cnpj,
		email,
		password,
		phone,
		planId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(201).send()
	})
}
