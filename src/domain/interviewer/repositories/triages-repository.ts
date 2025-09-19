import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { Triage } from '../entities/triage'

export interface TriagesRepository {
	findAll(params: PaginationParams): Promise<Triage[] | null>
	findById(triageId: string): Promise<Triage | null>
	findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Triage[] | null>
	findByAppointmentId(appointmentId: string): Promise<Triage | null>
	create(triage: Triage): Promise<void>
	update(triage: Triage): Promise<void>
	delete(triage: Triage): Promise<void>
}
