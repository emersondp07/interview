import { DeleteClientUseCase } from '@/application/company/use-cases/delete-client'
import type { DeleteClientParams } from '@/application/company/validators/delete-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.params as DeleteClientParams

	const prismaClientsRepository = new PrismaClientsRepository()
	const deleteClientUseCase = new DeleteClientUseCase(prismaClientsRepository)

	await deleteClientUseCase.execute({
		clientId,
	})

	return reply.status(204).send()
}
