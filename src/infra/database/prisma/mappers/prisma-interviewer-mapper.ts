import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Interviewer } from '@/domain/interviewer/entities/interviewer'
import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import type {
	Interviewer as PrismaInterviewer,
	PROFESSIONAL_REGISTRATIONS as PrismaProfessionalRegistrations,
	ROLE as PrismaRole,
	SPECIALTIES as PrismaSpecialties,
} from '@prisma/client'
import type {
	PROFESSIONAL_REGISTRATIONS,
	SPECIALTIES,
} from '../../../../domain/interviewer/entities/interfaces/interviewer.type'

export class PrismaInterviewerMapper {
	static toPrisma(interviewer: Interviewer): PrismaInterviewer {
		return {
			id: interviewer.id.toString(),
			name: interviewer.name,
			email: interviewer.email,
			password: interviewer.password,
			specialty: interviewer.specialty as PrismaSpecialties,
			profissional_registration:
				interviewer.profissionalRegistration as PrismaProfessionalRegistrations,
			number_registration: interviewer.numberRegistration,
			experience: interviewer.experience ?? null,
			bio: interviewer.bio,
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
				specialty: raw.specialty as SPECIALTIES,
				profissionalRegistration:
					raw.profissional_registration as PROFESSIONAL_REGISTRATIONS,
				numberRegistration: raw.number_registration,
				experience: raw.experience ?? undefined,
				bio: raw.bio,
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
