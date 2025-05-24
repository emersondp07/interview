import { DeleteClientUseCase } from '@/domain/company/application/use-cases/delete-client'
import type { DeleteClientSchema } from '@/domain/company/application/validators/delete-client.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.body as DeleteClientSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const deleteClientUseCase = new DeleteClientUseCase(prismaClientsRepository)

	await deleteClientUseCase.execute({
		clientId,
	})

	return reply.status(201).send()
}
