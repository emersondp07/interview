import { SendContractUseCase } from '@/application/interviewer/use-cases/send-contract'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { SendContractSchema } from '@application/interviewer/validators/send-contract.schema'
import type { Socket } from 'socket.io'

export async function sendContract(data: SendContractSchema, socket: Socket) {
	const { clientId, interviewId } = data

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const sendContractUseCase = new SendContractUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await sendContractUseCase.execute({ interviewId, clientId })

	if (value instanceof ResourceNotFoundError) {
		return socket.emit('error', value)
	}

	socket.emit('send-contract:response', {
		message: 'Contract sent successfully',
		interview: value.interview,
	})
	socket.to(`room-${interviewId}`).emit('send-contract:response', {
		message: 'Contract sent successfully',
		interview: value.interview,
	})
}
