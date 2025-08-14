import { Client } from '@/domain/client/entities/client'
import type {
	DOCUMENT_TYPE,
	GENDER,
} from '@/domain/client/entities/interfaces/client.type'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import type {
	Client as PrismaClient,
	GENDER as PrismaGender,
	Interview as PrismaInterview,
	ROLE as PrismaRole,
} from '@prisma/client'
import { InterviewList } from '../../../../application/company/use-cases/interview-list'
import { PrismaInterviewMapper } from './prisma-interview-mapper'

export class PrismaClientMapper {
	static toPrisma(client: Client): PrismaClient {
		return {
			id: client.id.toString(),
			name: client.name,
			document_type: client.documentType,
			document: client.document,
			phone: client.phone,
			birth_date: new Date(client.birthDate),
			age: client.age,
			gender: client.gender as PrismaGender,
			email: client.email,
			emergency_contact: client.emergencyContact ?? null,
			emergency_phone: client.emergencyPhone ?? null,
			medical_history: client.medicalHistory ?? null,
			allergies: client.allergies ?? null,
			medications: client.medications ?? null,
			company_id: client.companyId.toString(),
			role: client.role as PrismaRole,
			created_at: client.createdAt,
			updated_at: client.updatedAt,
			deleted_at: client.deletedAt ?? null,
		}
	}

	static toDomain(
		raw: PrismaClient & { interviews?: PrismaInterview[] },
	): Client {
		const interviewList = new InterviewList()

		const interviews = raw.interviews?.map((interview) =>
			PrismaInterviewMapper.toDomain(interview),
		)

		interviewList.currentItems = interviews || []

		return Client.create(
			{
				name: raw.name,
				documentType: raw.document_type as DOCUMENT_TYPE.CPF | DOCUMENT_TYPE.RG,
				document: raw.document,
				phone: raw.phone,
				birthDate: new Date(raw.birth_date),
				age: raw.age,
				gender: raw.gender as GENDER,
				email: raw.email,
				emergencyContact: raw.emergency_contact ?? undefined,
				emergencyPhone: raw.emergency_phone ?? undefined,
				medicalHistory: raw.medical_history ?? undefined,
				allergies: raw.allergies ?? undefined,
				medications: raw.medications ?? undefined,
				companyId: new UniqueEntityID(raw.company_id),
				role: raw.role as ROLE.CLIENT,
				interviews: interviewList,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at,
				deletedAt: raw.deleted_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
