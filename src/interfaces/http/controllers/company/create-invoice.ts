import { CreateInvoiceUseCase } from '@/application/company/use-cases/create-invoice'
import type { CreateInvoiceSchema } from '@/application/company/validators/create-invoice.schema'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createInvoice(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { mounth, value, companyId, stripeInvoiceId } =
		request.body as CreateInvoiceSchema

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const createInvoiceUseCase = new CreateInvoiceUseCase(
		prismaInvoicesRepository,
		prismaCompaniesRepository,
	)

	await createInvoiceUseCase.execute({
		mounth,
		value,
		companyId,
		stripeInvoiceId,
	})

	return reply.status(201).send()
}
