import { FinishInterviewUseCase } from '@/domain/interviewer/application/use-cases/finish-interview'
import type { FinishInteviewSchema } from '@/domain/interviewer/application/validators/finish-interview.schema'
import { PrismaInterviewsRepository } from '@/infra/database/repositories/prisma-interviews-repository'
import type { Socket } from 'socket.io'

export async function finishInterview(
	data: FinishInteviewSchema,
	socket: Socket,
) {
	const { clientId, interviewId } = data

	const prismaInterviewsRepository = new PrismaInterviewsRepository()
	const finishInterviewUseCase = new FinishInterviewUseCase(
		prismaInterviewsRepository,
	)

	await finishInterviewUseCase.execute({ interviewId })

	socket.leave(interviewId)

	socket.on('disconnect', (data) => {
		socket.emit('finished', data)
	})
}
