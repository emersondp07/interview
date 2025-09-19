import { type Either, success } from '@/domain/core/either'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

interface SubmitInterviewAnswersUseCaseRequest {
	clientId: string
	answers: Array<{
		questionId: string
		selectedOption: string
	}>
}

type SubmitInterviewAnswersUseCaseResponse = Either<
	null,
	{ interviewAnswers: InterviewAnswer[] }
>

export class SubmitInterviewAnswersUseCase {
	constructor(
		private readonly interviewAnswersRepository: InterviewAnswersRepository,
	) {}

	async execute({
		clientId,
		answers,
	}: SubmitInterviewAnswersUseCaseRequest): Promise<SubmitInterviewAnswersUseCaseResponse> {
		const clientEntityId = new UniqueEntityID(clientId)
		const interviewAnswers: InterviewAnswer[] = []

		for (const answer of answers) {
			const interviewAnswer = InterviewAnswer.create({
				clientId: clientEntityId,
				questionId: new UniqueEntityID(answer.questionId),
				selectedOption: answer.selectedOption,
			})

			await this.interviewAnswersRepository.create(interviewAnswer)
			interviewAnswers.push(interviewAnswer)
		}

		return success({
			interviewAnswers,
		})
	}
}
