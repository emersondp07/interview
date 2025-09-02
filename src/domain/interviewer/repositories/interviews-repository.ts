import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { Interview } from '../entities/interview'

export interface InterviewsRepository {
	findAll(params: PaginationParams): Promise<Interview[] | null>
	findById(interviewId: string): Promise<Interview | null>
	getDetailsById(interviewId: string): Promise<Interview | null>
	create(interview: Interview): Promise<void>
	finishInterview(interview: Interview): Promise<void>
	startInterview(interview: Interview): Promise<void>
	sendContract(interview: Interview): Promise<void>
}
