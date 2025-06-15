import { FinishInterviewUseCase } from '@/domain/interviewer/application/use-cases/finish-interview'
import type { FinishInteviewSchema } from '@/domain/interviewer/application/validators/finish-interview.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
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

	socket.leave(interviewId)
	socket.to(`room-${interviewId}`).emit('finish-interview:response', {
		message: 'Interview finished successfully',
	})

	socket.on('disconnect', (data) => {
		socket.emit('finished', data)
	})
}
