import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { MedicalHistory } from '../entities/medical-history'

export interface MedicalHistoryRepository {
	findAll(params: PaginationParams): Promise<MedicalHistory[] | null>
	findById(historyId: string): Promise<MedicalHistory | null>
	findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<MedicalHistory[] | null>
	findByInterviewId(interviewId: string): Promise<MedicalHistory[] | null>
	findByType(clientId: string, type: string): Promise<MedicalHistory[] | null>
	create(medicalHistory: MedicalHistory): Promise<void>
	update(medicalHistory: MedicalHistory): Promise<void>
	delete(medicalHistory: MedicalHistory): Promise<void>
}
