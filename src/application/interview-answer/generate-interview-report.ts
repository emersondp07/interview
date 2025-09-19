import { type Either, success } from '@/domain/core/either'
import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'

interface GenerateInterviewReportUseCaseRequest {
	clientId: string
}

interface InterviewReportData {
	clientId: string
	totalAnswers: number
	answersData: Array<{
		questionId: string
		selectedOption: string
		answeredAt: Date
	}>
	generatedAt: Date
}

type GenerateInterviewReportUseCaseResponse = Either<
	null,
	{ report: InterviewReportData }
>

export class GenerateInterviewReportUseCase {
	constructor(
		private readonly interviewAnswersRepository: InterviewAnswersRepository,
	) {}

	async execute({
		clientId,
	}: GenerateInterviewReportUseCaseRequest): Promise<GenerateInterviewReportUseCaseResponse> {
		const interviewAnswers =
			await this.interviewAnswersRepository.findByClientId(clientId)

		if (!interviewAnswers) {
			return success({
				report: {
					clientId,
					totalAnswers: 0,
					answersData: [],
					generatedAt: new Date(),
				},
			})
		}

		const report: InterviewReportData = {
			clientId,
			totalAnswers: interviewAnswers.length,
			answersData: interviewAnswers.map((answer) => ({
				questionId: answer.questionId.toString(),
				selectedOption: answer.selectedOption,
				answeredAt: answer.createdAt,
			})),
			generatedAt: new Date(),
		}

		return success({
			report,
		})
	}
}
