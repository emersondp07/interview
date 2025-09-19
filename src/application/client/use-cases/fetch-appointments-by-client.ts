import type { Appointment } from '@/domain/client/entities/appointment'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import { type Either, success } from '@/domain/core/either'

interface FetchAppointmentsByClientUseCaseRequest {
	clientId: string
}

type FetchAppointmentsByClientUseCaseResponse = Either<
	null,
	{ appointments: Appointment[] }
>

export class FetchAppointmentsByClientUseCase {
	constructor(
		private readonly appointmentsRepository: AppointmentsRepository,
	) {}

	async execute({
		clientId,
	}: FetchAppointmentsByClientUseCaseRequest): Promise<FetchAppointmentsByClientUseCaseResponse> {
		const appointments = await this.appointmentsRepository.findByClientId(
			clientId,
			{ page: 1 },
		)

		return success({
			appointments: appointments || [],
		})
	}
}
