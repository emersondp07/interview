import { GetCompanyUseCase } from '@/domain/administrator/application/use-cases/get-company'
import type { GetCompanySchema } from '@/domain/administrator/application/validators/get-company.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getCompany(request: FastifyRequest, reply: FastifyReply) {
	const { companyId } = request.params as GetCompanySchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const getCompanyUseCase = new GetCompanyUseCase(prismaCompaniesRepository)

	const { value } = await getCompanyUseCase.execute({ companyId })

	return reply.status(200).send(value)
}
