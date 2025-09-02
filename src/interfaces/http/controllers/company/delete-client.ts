import { DeleteClientUseCase } from '@/application/company/use-cases/delete-client'
import type { DeleteClientParams } from '@/application/company/validators/delete-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sub: companyId } = request.user

	const { clientId } = request.params as DeleteClientParams

	const prismaClientsRepository = new PrismaClientsRepository()
	const deleteClientUseCase = new DeleteClientUseCase(prismaClientsRepository)

	const result = await deleteClientUseCase.execute({
		companyId,
		clientId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}
