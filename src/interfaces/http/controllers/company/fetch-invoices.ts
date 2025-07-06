import { FetchInvoicesUseCase } from '@/application/company/use-cases/fetch-invoices'
import type { FetchInvoicesSchema } from '@/application/company/validators/fetch-invoices.schema'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchInvoices(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { page } = request.query as FetchInvoicesSchema

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const fetchInvoicesUseCase = new FetchInvoicesUseCase(
		prismaInvoicesRepository,
	)

	const { value } = await fetchInvoicesUseCase.execute({ page })

	return reply.status(200).send(value)
}
