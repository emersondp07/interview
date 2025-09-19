import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { Appointment } from '../entities/appointment'

export interface AppointmentsRepository {
	findAll(params: PaginationParams): Promise<Appointment[] | null>
	findById(appointmentId: string): Promise<Appointment | null>
	findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Appointment[] | null>
	findByInterviewerId(
		interviewerId: string,
		params: PaginationParams,
	): Promise<Appointment[] | null>
	create(appointment: Appointment): Promise<void>
	update(appointment: Appointment): Promise<void>
	delete(appointment: Appointment): Promise<void>
}
