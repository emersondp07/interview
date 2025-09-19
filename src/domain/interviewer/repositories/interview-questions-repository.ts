import type { PaginationParams } from '../../core/repositories/pagination-params'
import type { InterviewQuestion } from '../entities/interview-question'

export interface InterviewQuestionsRepository {
	findAll(params: PaginationParams): Promise<InterviewQuestion[] | null>
	findById(questionId: string): Promise<InterviewQuestion | null>
	findByInterviewId(interviewId: string): Promise<InterviewQuestion[] | null>
	create(interviewQuestion: InterviewQuestion): Promise<void>
	update(
		questionId: string,
		interviewQuestion: InterviewQuestion,
	): Promise<void>
	delete(questionId: string): Promise<void>
}
