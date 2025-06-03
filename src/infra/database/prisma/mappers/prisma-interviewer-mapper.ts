import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { Interviewer } from '@/domain/interviewer/enterprise/entities/interviewer'
import type {
	Interviewer as PrismaInterviewer,
	ROLE as PrismaRole,
} from '@prisma/client'

export class PrismaInterviewerMapper {
	static toPrisma(interviewer: Interviewer): PrismaInterviewer {
		return {
			id: interviewer.id.toString(),
			name: interviewer.name,
			email: interviewer.email,
			password: interviewer.password,
			role: interviewer.role as PrismaRole,
			created_at: interviewer.createdAt,
			updated_at: interviewer.updatedAt,
			deleted_at: interviewer.deletedAt ?? null,
			company_id: interviewer.companyId.toString(),
		}
	}

	static toDomain(raw: PrismaInterviewer): Interviewer {
		return Interviewer.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				role: raw.role as ROLE.INTERVIEWER,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at,
				deletedAt: raw.deleted_at ?? undefined,
				companyId: new UniqueEntityID(raw.company_id),
			},
			new UniqueEntityID(raw.id),
		)
	}
}
