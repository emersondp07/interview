import { CreateTriageUseCase } from '@/application/interviewer/use-cases/create-triage'
import type { CreateTriageSchema } from '@/application/interviewer/validators/create-triage.schema'
import { PrismaTriagesRepository } from '@/infra/database/repositories/prisma-triages-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createTriage(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId, notes, vitalSigns, nurseName } = request.body as CreateTriageSchema

	const prismaTriagesRepository = new PrismaTriagesRepository()
	const createTriageUseCase = new CreateTriageUseCase(
		prismaTriagesRepository,
	)

	const result = await createTriageUseCase.execute({
		clientId,
		notes,
		vitalSigns,
		nurseName,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(201).send({ triage: value.triage })
	})
}