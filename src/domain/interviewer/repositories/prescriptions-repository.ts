import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { Prescription } from '../entities/prescription'

export interface PrescriptionsRepository {
	findAll(params: PaginationParams): Promise<Prescription[] | null>
	findById(prescriptionId: string): Promise<Prescription | null>
	findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Prescription[] | null>
	findByInterviewerId(
		interviewerId: string,
		params: PaginationParams,
	): Promise<Prescription[] | null>
	findByInterviewId(interviewId: string): Promise<Prescription[] | null>
	create(prescription: Prescription): Promise<void>
	update(prescription: Prescription): Promise<void>
	delete(prescription: Prescription): Promise<void>
}
