import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import type { InterviewAnswer as PrismaInterviewAnswer } from '@prisma/client'

export class PrismaInterviewAnswerMapper {
	static toPrisma(interviewAnswer: InterviewAnswer): PrismaInterviewAnswer {
		return {
			id: interviewAnswer.id.toString(),
			client_id: interviewAnswer.clientId.toString(),
			question_id: interviewAnswer.questionId.toString(),
			selected_option: interviewAnswer.selectedOption,
			created_at: interviewAnswer.createdAt,
			updated_at: interviewAnswer.updatedAt ?? null,
			deleted_at: interviewAnswer.deletedAt ?? null,
		}
	}

	static toDomain(raw: PrismaInterviewAnswer): InterviewAnswer {
		return InterviewAnswer.create(
			{
				clientId: new UniqueEntityID(raw.client_id),
				questionId: new UniqueEntityID(raw.question_id),
				selectedOption: raw.selected_option,
				createdAt: raw.created_at,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
