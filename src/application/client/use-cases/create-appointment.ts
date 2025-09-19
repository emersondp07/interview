import { Appointment } from '@/domain/client/entities/appointment'
import {
	type SPECIALTIES,
	STATUS_APPOINTMENT,
} from '@/domain/client/entities/interfaces/appointment.type'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import { type Either, success } from '@/domain/core/either'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'

interface CreateAppointmentUseCaseRequest {
	clientId: string
	scheduledAt: Date
	specialty: SPECIALTIES
	interviewerId?: string
}

type CreateAppointmentUseCaseResponse = Either<
	null,
	{ appointment: Appointment }
>

export class CreateAppointmentUseCase {
	constructor(
		private readonly appointmentsRepository: AppointmentsRepository,
	) {}

	async execute({
		clientId,
		scheduledAt,
		specialty,
		interviewerId,
	}: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
		const clientEntityId = new UniqueEntityID(clientId)
		const interviewerEntityId = interviewerId
			? new UniqueEntityID(interviewerId)
			: undefined

		const appointment = Appointment.create({
			clientId: clientEntityId,
			scheduledAt,
			specialty,
			status: STATUS_APPOINTMENT.SCHEDULED,
			interviewerId: interviewerEntityId,
		})

		await this.appointmentsRepository.create(appointment)

		return success({
			appointment,
		})
	}
}
