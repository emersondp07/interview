import { StartInterviewUseCase } from '@/application/interviewer/use-cases/start-interview'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { StartInterviewSchema } from '@application/interviewer/validators/start-interview.schema'
import type { Socket } from 'socket.io'
import { waitingQueue } from '../../socket/namespace/interview-namespace'

export async function startInterview(
	event: StartInterviewSchema,
	socket: Socket,
) {
	const { clientId, interviewId } = event

	const prismaClientsRepository = new PrismaClientsRepository()
	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const startInterviewUseCase = new StartInterviewUseCase(
		prismaClientsRepository,
		prismaInterviewsRepository,
	)

	const { value } = await startInterviewUseCase.execute({
		clientId,
		interviewId,
	})

	if (value instanceof ResourceNotFoundError) {
		return socket.emit('error', value)
	}

	const clientConnection = waitingQueue.get(clientId)

	const roomId = `room-${interviewId}`

	socket.join(roomId)
	clientConnection?.join(roomId)

	waitingQueue.delete(clientId)

	socket.emit('start-interview:response', {
		message: 'Interview started successfully',
		interview: value,
	})
}
