import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { VitalSigns } from '../entities/vital-signs'

export interface VitalSignsRepository {
	findAll(params: PaginationParams): Promise<VitalSigns[] | null>
	findById(vitalSignsId: string): Promise<VitalSigns | null>
	findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<VitalSigns[] | null>
	findByInterviewId(interviewId: string): Promise<VitalSigns[] | null>
	findLatestByClientId(clientId: string): Promise<VitalSigns | null>
	create(vitalSigns: VitalSigns): Promise<void>
	update(vitalSigns: VitalSigns): Promise<void>
	delete(vitalSigns: VitalSigns): Promise<void>
}
