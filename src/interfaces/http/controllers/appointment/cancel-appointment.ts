import { CancelAppointmentUseCase } from '@/application/client/use-cases/cancel-appointment'
import type { CancelAppointmentParams } from '@/application/client/validators/cancel-appointment.schema'
import { PrismaAppointmentsRepository } from '@/infra/database/repositories/prisma-appointments-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function cancelAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { appointmentId } = request.params as CancelAppointmentParams

	const prismaAppointmentsRepository = new PrismaAppointmentsRepository()
	const cancelAppointmentUseCase = new CancelAppointmentUseCase(
		prismaAppointmentsRepository,
	)

	const result = await cancelAppointmentUseCase.execute({
		appointmentId,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}