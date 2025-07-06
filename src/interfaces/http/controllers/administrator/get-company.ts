import { GetCompanyUseCase } from '@/application/administrator/use-cases/get-company'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { GetCompanySchema } from '@application/administrator/validators/get-company.schema'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getCompany(request: FastifyRequest, reply: FastifyReply) {
	const { companyId } = request.params as GetCompanySchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const getCompanyUseCase = new GetCompanyUseCase(prismaCompaniesRepository)

	const { value } = await getCompanyUseCase.execute({ companyId })

	return reply.status(200).send(value)
}
