import type { Appointment } from '@/domain/client/entities/appointment'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface AssignInterviewerToAppointmentUseCaseRequest {
	appointmentId: string
	interviewerId: string
}

type AssignInterviewerToAppointmentUseCaseResponse = Either<
	ResourceNotFoundError,
	{ appointment: Appointment }
>

export class AssignInterviewerToAppointmentUseCase {
	constructor(
		private readonly appointmentsRepository: AppointmentsRepository,
	) {}

	async execute({
		appointmentId,
		interviewerId,
	}: AssignInterviewerToAppointmentUseCaseRequest): Promise<AssignInterviewerToAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentsRepository.findById(appointmentId)

		if (!appointment) {
			return failed(new ResourceNotFoundError())
		}

		const interviewerEntityId = new UniqueEntityID(interviewerId)
		appointment.assignInterviewer(interviewerEntityId)

		await this.appointmentsRepository.update(appointment)

		return success({
			appointment,
		})
	}
}
