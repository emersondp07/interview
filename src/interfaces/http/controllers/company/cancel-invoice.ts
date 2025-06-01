import { CancelInvoiceUseCase } from '@/domain/company/application/use-cases/cancel-invoice'
import { PrismaInvoicesRepository } from '@/infra/database/repositories/prisma-invoices-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CancelInvoiceParams } from '../../../../domain/company/application/validators/cancel-invoice.schema'

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
