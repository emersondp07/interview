import { FetchCompaniesUseCase } from '@/domain/administrator/application/use-cases/fetch-companies'
import type { FetchCompaniesSchema } from '@/domain/administrator/application/validators/fetch-companies.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchCompanies(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { page } = request.query as FetchCompaniesSchema

	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const fetchCompaniesUseCase = new FetchCompaniesUseCase(
		prismaCompaniesRepository,
	)

	const { value } = await fetchCompaniesUseCase.execute({ page })

	return reply.status(200).send(value)
}
