import { UpdateTriageUseCase } from '@/application/interviewer/use-cases/update-triage'
import type { UpdateTriageParams, UpdateTriageSchema } from '@/application/interviewer/validators/update-triage.schema'
import { PrismaTriagesRepository } from '@/infra/database/repositories/prisma-triages-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateTriage(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { triageId } = request.params as UpdateTriageParams
	const { notes, vitalSigns, nurseName } = request.body as UpdateTriageSchema

	const prismaTriagesRepository = new PrismaTriagesRepository()
	const updateTriageUseCase = new UpdateTriageUseCase(
		prismaTriagesRepository,
	)

	const result = await updateTriageUseCase.execute({
		triageId,
		notes,
		vitalSigns,
		nurseName,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}