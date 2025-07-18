import { FinishInterviewUseCase } from '@/application/interviewer/use-cases/finish-interview'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { FinishInteviewSchema } from '@application/interviewer/validators/finish-interview.schema'
import type { Socket } from 'socket.io'

export async function finishInterview(
	data: FinishInteviewSchema,
	socket: Socket,
) {
	const { clientId, interviewId } = data

	const prismaClientsRepository = new PrismaClientsRepository()
	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const finishInterviewUseCase = new FinishInterviewUseCase(
		prismaClientsRepository,
		prismaInterviewsRepository,
	)

	await finishInterviewUseCase.execute({ interviewId, clientId })

	// socket.leave(interviewId)
	socket.to(`room-${interviewId}`).emit('finish-interview:response', {
		message: 'Interview finished successfully',
	})

	socket.emit('finish-interview:response', {
		message: 'Interview finished successfully',
	})

	socket.on('disconnect', (data) => {
		socket.emit('finish-interview:response', data)
	})
}
