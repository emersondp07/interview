import { CreateAppointmentUseCase } from '@/application/client/use-cases/create-appointment'
import type { CreateAppointmentSchema } from '@/application/client/validators/create-appointment.schema'
import { PrismaAppointmentsRepository } from '@/infra/database/repositories/prisma-appointments-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createAppointment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { clientId, specialty, scheduledAt } = request.body as CreateAppointmentSchema

	const prismaAppointmentsRepository = new PrismaAppointmentsRepository()
	const createAppointmentUseCase = new CreateAppointmentUseCase(
		prismaAppointmentsRepository,
	)

	const result = await createAppointmentUseCase.execute({
		clientId,
		specialty,
		scheduledAt,
	})

	return handleResult(result, reply, async (value) => {
		return reply.status(201).send({ appointment: value.appointment })
	})
}