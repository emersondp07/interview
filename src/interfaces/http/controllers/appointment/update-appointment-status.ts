import { UpdateAppointmentStatusUseCase } from '@/application/client/use-cases/update-appointment-status'
import type { UpdateAppointmentStatusParams, UpdateAppointmentStatusSchema } from '@/application/client/validators/update-appointment-status.schema'
import { PrismaAppointmentsRepository } from '@/infra/database/repositories/prisma-appointments-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateAppointmentStatus(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { appointmentId } = request.params as UpdateAppointmentStatusParams
	const { status } = request.body as UpdateAppointmentStatusSchema

	const prismaAppointmentsRepository = new PrismaAppointmentsRepository()
	const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(
		prismaAppointmentsRepository,
	)

	const result = await updateAppointmentStatusUseCase.execute({
		appointmentId,
		status,
	})

	return handleResult(result, reply, async () => {
		return reply.status(204).send()
	})
}