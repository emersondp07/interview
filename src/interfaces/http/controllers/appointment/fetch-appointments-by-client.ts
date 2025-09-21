import { FetchAppointmentsByClientUseCase } from '@/application/client/use-cases/fetch-appointments-by-client'
import type { FetchAppointmentsByClientParams } from '@/application/client/validators/fetch-appointments-by-client.schema'
import { PrismaAppointmentsRepository } from '@/infra/database/repositories/prisma-appointments-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchAppointmentsByClient(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId } = request.params as FetchAppointmentsByClientParams

	const prismaAppointmentsRepository = new PrismaAppointmentsRepository()
	const fetchAppointmentsByClientUseCase = new FetchAppointmentsByClientUseCase(
		prismaAppointmentsRepository,
	)

	const result = await fetchAppointmentsByClientUseCase.execute({
		clientId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}