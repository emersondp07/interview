import { FetchInvoicesUseCase } from '@/application/company/use-cases/fetch-invoices'
import type { FetchInvoicesSchema } from '@/application/company/validators/fetch-invoices.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInvoices(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user

	const { page } = request.query as FetchInvoicesSchema

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const fetchInvoicesUseCase = new FetchInvoicesUseCase(
		prismaInvoicesRepository,
		prismaCompaniesRepository,
	)

	const { value } = await fetchInvoicesUseCase.execute({ companyId, page })

	return reply.status(200).send(value)
}
