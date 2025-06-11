import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { SendContractUseCase } from '@/domain/interviewer/application/use-cases/send-contract'
import type { SendContractSchema } from '@/domain/interviewer/application/validators/send-contract.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { Socket } from 'socket.io'

export async function sendContract(data: SendContractSchema, socket: Socket) {
	const { interviewId } = data as SendContractSchema

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const sendContractUseCase = new SendContractUseCase(
		prismaInterviewsRepository,
	)

	const { value } = await sendContractUseCase.execute({ interviewId })

	if (value instanceof ResourceNotFoundError) {
		return socket.emit('error', value)
	}

	socket.emit('send-contract:response')
}
