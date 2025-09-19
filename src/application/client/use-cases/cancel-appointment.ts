import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface CancelAppointmentUseCaseRequest {
	appointmentId: string
}

type CancelAppointmentUseCaseResponse = Either<ResourceNotFoundError, {}>

export class CancelAppointmentUseCase {
	constructor(
		private readonly appointmentsRepository: AppointmentsRepository,
	) {}

	async execute({
		appointmentId,
	}: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
		const appointment =
			await this.appointmentsRepository.findById(appointmentId)

		if (!appointment) {
			return failed(new ResourceNotFoundError())
		}

		await this.appointmentsRepository.delete(appointment)

		return success({})
	}
}
