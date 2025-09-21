import { AssignInterviewerToAppointmentUseCase } from '@/application/client/use-cases/assign-interviewer-to-appointment'
import type { AssignInterviewerToAppointmentParams, AssignInterviewerToAppointmentSchema } from '@/application/client/validators/assign-interviewer-to-appointment.schema'
import { PrismaAppointmentsRepository } from '@/infra/database/repositories/prisma-appointments-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function assignInterviewerToAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { appointmentId } = request.params as AssignInterviewerToAppointmentParams
	const { interviewerId } = request.body as AssignInterviewerToAppointmentSchema

	const prismaAppointmentsRepository = new PrismaAppointmentsRepository()
	const assignInterviewerToAppointmentUseCase = new AssignInterviewerToAppointmentUseCase(
		prismaAppointmentsRepository,
	)

	const result = await assignInterviewerToAppointmentUseCase.execute({
		appointmentId,
		interviewerId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}