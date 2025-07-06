import { CancelInvoiceUseCase } from '@/application/company/use-cases/cancel-invoice'
import type { CancelInvoiceParams } from '@/application/company/validators/cancel-invoice.schema'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function cancelInvoice(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { invoiceId, signatureId } = request.params as CancelInvoiceParams

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
