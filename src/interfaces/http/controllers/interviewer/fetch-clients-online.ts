import { FetchClientsOnlineUseCase } from '@/domain/client/application/use-cases/fetch-clients-online'
import type { FetchInterviewsSchema } from '@/domain/interviewer/application/validators/fetch-interviews.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import type { Socket } from 'socket.io'
import { waitingQueue } from '../../socket/namespace/interview-namespace'

export async function fetchClientsOnline(
	data: FetchInterviewsSchema,
	socket: Socket,
) {
	const clientIds = Array.from(waitingQueue.keys())
	const { page } = data as FetchInterviewsSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const fetchClientsOnlineUseCase = new FetchClientsOnlineUseCase(
		prismaClientsRepository,
	)

	const { value } = await fetchClientsOnlineUseCase.execute({ page, clientIds })

	socket.emit('list-client:response', value)
}
