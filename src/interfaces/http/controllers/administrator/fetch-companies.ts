import { FetchCompaniesUseCase } from '@/application/administrator/use-cases/fetch-companies'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FetchCompaniesSchema } from '@application/administrator/validators/fetch-companies.schema'
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

	const result = await fetchCompaniesUseCase.execute({ page })

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}
