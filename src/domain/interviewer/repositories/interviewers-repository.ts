import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { Interviewer } from '../entities/interviewer'

export interface InterviewersRepository {
	findAll(
		companyId: string,
		params: PaginationParams,
	): Promise<Interviewer[] | null>
	findById(
		companyId: string,
		interviewerId: string,
	): Promise<Interviewer | null>
	findByEmail(email: string): Promise<Interviewer | null>
	create(interviewer: Interviewer): Promise<void>
	delete(interviewer: Interviewer): Promise<void>
}
