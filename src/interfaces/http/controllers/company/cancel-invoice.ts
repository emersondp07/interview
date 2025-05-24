import { CancelInvoiceUseCase } from '@/domain/company/application/use-cases/cancel-invoice'
import type { CancelInvoiceSchema } from '@/domain/company/application/validators/cancel-invoice.schema'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function cancelInvoice(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { invoiceId, signatureId } = request.body as CancelInvoiceSchema

	const prismaInvoicesRepository = new PrismaInvoicesRepository()
	const cancelInvoiceUseCase = new CancelInvoiceUseCase(
		prismaInvoicesRepository,
	)

	await cancelInvoiceUseCase.execute({
		invoiceId,
		signatureId,
	})

	return reply.status(204).send()
}
