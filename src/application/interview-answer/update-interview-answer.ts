import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

interface UpdateInterviewAnswerUseCaseRequest {
	interviewAnswerId: string
	selectedOption: string
}

type UpdateInterviewAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{ interviewAnswer: InterviewAnswer }
>

export class UpdateInterviewAnswerUseCase {
	constructor(
		private readonly interviewAnswersRepository: InterviewAnswersRepository,
	) {}

	async execute({
		interviewAnswerId,
		selectedOption,
	}: UpdateInterviewAnswerUseCaseRequest): Promise<UpdateInterviewAnswerUseCaseResponse> {
		const interviewAnswer =
			await this.interviewAnswersRepository.findById(interviewAnswerId)

		if (!interviewAnswer) {
			return failed(new ResourceNotFoundError())
		}

		interviewAnswer.changeSelectedOption(selectedOption)

		await this.interviewAnswersRepository.update(interviewAnswer)

		return success({
			interviewAnswer,
		})
	}
}
