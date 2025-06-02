import { CreateInvoiceUseCase } from '@/domain/company/application/use-cases/create-invoice'
import type { CreateInvoiceSchema } from '@/domain/company/application/validators/create-invoice.schema'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import { PrismaSignaturesRepository } from '@/infra/database/repositories/prisma-signatures-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createInvoice(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { mounth, value, status, signatureId } =
		request.body as CreateInvoiceSchema

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const prismaSignaturesRepository = new PrismaSignaturesRepository()
	const createInvoiceUseCase = new CreateInvoiceUseCase(
		prismaInvoicesRepository,
		prismaSignaturesRepository,
	)

	await createInvoiceUseCase.execute({
		mounth,
		value,
		status,
		signatureId,
	})

	return reply.status(201).send()
}
