import type { InterviewAnswer } from '../entities/interview-answer'

export interface InterviewAnswersRepository {
	findAll(): Promise<InterviewAnswer[] | null>
	findById(answerId: string): Promise<InterviewAnswer | null>
	findByClientId(clientId: string): Promise<InterviewAnswer[] | null>
	findByQuestionId(questionId: string): Promise<InterviewAnswer[] | null>
	findByClientAndQuestion(
		clientId: string,
		questionId: string,
	): Promise<InterviewAnswer | null>
	create(interviewAnswer: InterviewAnswer): Promise<void>
	update(interviewAnswer: InterviewAnswer): Promise<void>
	delete(interviewAnswer: InterviewAnswer): Promise<void>
}
