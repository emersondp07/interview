import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import { Interview } from '@/domain/interviewer/entities/interview'
import type {
	Interview as PrismaInterview,
	STATUS_INTERVIEW as PrismaStatusInterview,
} from '@prisma/client'

export class PrismaInterviewMapper {
	static toPrisma(interview: Interview): PrismaInterview {
		return {
			id: interview.id.toString(),
			client_id: interview.clientId.toString(),
			interviewer_id: interview.interviewerId?.toString() ?? null,
			company_id: interview.companyId.toString(),
			status: interview.status as PrismaStatusInterview,
			created_at: interview.createdAt,
			updated_at: interview.updatedAt,
			deleted_at: interview.deletedAt ?? null,
		}
	}

	static toDomain(raw: PrismaInterview): Interview {
		return Interview.create(
			{
				clientId: new UniqueEntityID(raw.client_id),
				interviewerId: raw.interviewer_id
					? new UniqueEntityID(raw.interviewer_id)
					: undefined,
				companyId: new UniqueEntityID(raw.company_id),
				status: raw.status as STATUS_INTERVIEW,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
