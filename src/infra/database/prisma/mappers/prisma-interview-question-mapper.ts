import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestion as PrismaInterviewQuestion } from '@prisma/client'

export class PrismaInterviewQuestionMapper {
	static toPrisma(
		interviewQuestion: InterviewQuestion,
	): PrismaInterviewQuestion {
		return {
			id: interviewQuestion.id.toString(),
			question: interviewQuestion.question,
			options: interviewQuestion.options,
			required: interviewQuestion.required,
			created_at: interviewQuestion.createdAt,
			updated_at: interviewQuestion.updatedAt,
			deleted_at: interviewQuestion.deletedAt ?? null,
			interview_id: interviewQuestion.interviewId?.toString() ?? null,
		}
	}

	static toDomain(raw: PrismaInterviewQuestion): InterviewQuestion {
		return InterviewQuestion.create(
			{
				question: raw.question,
				options: raw.options,
				required: raw.required,
				interviewId: raw.interview_id
					? new UniqueEntityID(raw.interview_id)
					: undefined,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at ?? undefined,
				deletedAt: raw.deleted_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
