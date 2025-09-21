import { FetchTriageByAppointmentUseCase } from '@/application/interviewer/use-cases/fetch-triage-by-appointment'
import type { FetchTriageByAppointmentParams } from '@/application/interviewer/validators/fetch-triage-by-appointment.schema'
import { PrismaTriagesRepository } from '@/infra/database/repositories/prisma-triages-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchTriageByAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { appointmentId } = request.params as FetchTriageByAppointmentParams

	const prismaTriagesRepository = new PrismaTriagesRepository()
	const fetchTriageByAppointmentUseCase = new FetchTriageByAppointmentUseCase(
		prismaTriagesRepository,
	)

	const result = await fetchTriageByAppointmentUseCase.execute({
		appointmentId,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(200).send(value)
	})
}