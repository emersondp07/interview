import { CalculateRiskScoreUseCase } from '@/application/interviewer/use-cases/calculate-risk-score'
import type { CalculateRiskScoreParams, CalculateRiskScoreSchema } from '@/application/interviewer/validators/calculate-risk-score.schema'
import { PrismaClientsRepository } from '@/infra/database/repositories/prisma-clients-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function calculateRiskScore(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.params as CalculateRiskScoreParams
	const { vitalSigns, riskFactors } = request.body as CalculateRiskScoreSchema

	const prismaClientsRepository = new PrismaClientsRepository()
	const calculateRiskScoreUseCase = new CalculateRiskScoreUseCase(
		prismaClientsRepository,
	)

	const result = await calculateRiskScoreUseCase.execute({
		clientId,
		vitalSigns,
		riskFactors,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}