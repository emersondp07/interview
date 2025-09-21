import type { Appointment } from '@/domain/client/entities/appointment'
import type { STATUS_APPOINTMENT } from '@/domain/client/entities/interfaces/appointment.type'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface UpdateAppointmentStatusUseCaseRequest {
	appointmentId: string
	status: STATUS_APPOINTMENT
}

type UpdateAppointmentStatusUseCaseResponse = Either<
	ResourceNotFoundError,
	{ appointment: Appointment }
>

export class UpdateAppointmentStatusUseCase {
	constructor(
		private readonly appointmentsRepository: AppointmentsRepository,
	) {}

	async execute({
		appointmentId,
		status,
	}: UpdateAppointmentStatusUseCaseRequest): Promise<UpdateAppointmentStatusUseCaseResponse> {
		const appointment =
			await this.appointmentsRepository.findById(appointmentId)

		if (!appointment) {
			return failed(new ResourceNotFoundError())
		}

		appointment.changeStatus(status)

		await this.appointmentsRepository.update(appointment)

		return success({
			appointment,
		})
	}
}
