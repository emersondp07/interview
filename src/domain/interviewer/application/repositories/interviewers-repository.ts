import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Interviewer } from '../../enterprise/entities/interviewer'

export interface InterviewersRepository {
	findAll(params: PaginationParams): Promise<Interviewer[] | null>
	findById(interviewerId: string): Promise<Interviewer | null>
	findByEmail(email: string): Promise<Interviewer | null>
	create(interviewer: Interviewer): Promise<void>
	delete(interviewerId: string): Promise<void>
}
