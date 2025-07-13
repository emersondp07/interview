import { GetClientByDocumentUseCase } from '@/application/client/use-cases/get-client-by-document'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { GetClientByDocumentSchema } from '@application/client/validators/get-client-by-document.schema'
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
