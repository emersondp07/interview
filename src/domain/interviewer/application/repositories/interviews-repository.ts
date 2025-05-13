import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Interview } from '../../enterprise/entities/interview'

export interface InterviewsRepository {
	findAll(params: PaginationParams): Promise<Interview[] | null>
	findById(interviewId: string): Promise<Interview | null>
	create(interview: Interview): Promise<void>
	finishInterview(interview: Interview): Promise<Interview | null>
	startInterview(interview: Interview): Promise<Interview | null>
	sendContract(interview: Interview): Promise<Interview | null>
}
