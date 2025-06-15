import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetClientByDocumentUseCase } from '@/domain/client/application/use-cases/get-client-by-document'
import type { GetClientByDocumentSchema } from '@/domain/client/application/validators/get-client-by-document.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { Socket } from 'socket.io'
import { waitingQueue } from '../../socket/namespace/interview-namespace'

export async function getClientByDocument(
	data: GetClientByDocumentSchema,
	socket: Socket,
) {
	const { document } = data

	const prismaClientsRepository = new PrismaClientsRepository()
	const getClientByDocumentUseCase = new GetClientByDocumentUseCase(
		prismaClientsRepository,
	)

	const { value } = await getClientByDocumentUseCase.execute({ document })

	if (value instanceof ResourceNotFoundError) {
		return socket.emit('error', value)
	}

	waitingQueue.set(value.client.id.toString(), socket)
	socket.emit('join-queue:response', {
		message: 'Client added to the waiting queue',
	})
}
