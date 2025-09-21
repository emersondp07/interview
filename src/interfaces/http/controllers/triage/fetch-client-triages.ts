import { FetchClientTriagesUseCase } from '@/application/interviewer/use-cases/fetch-client-triages'
import type { FetchClientTriagesParams } from '@/application/interviewer/validators/fetch-client-triages.schema'
import { PrismaTriagesRepository } from '@/infra/database/repositories/prisma-triages-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchClientTriages(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.params as FetchClientTriagesParams

	const prismaTriagesRepository = new PrismaTriagesRepository()
	const fetchClientTriagesUseCase = new FetchClientTriagesUseCase(
		prismaTriagesRepository,
	)

	const result = await fetchClientTriagesUseCase.execute({
		clientId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}