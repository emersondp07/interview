import { Client } from '@/domain/client/entities/client'
import type { DOCUMENT_TYPE } from '@/domain/client/entities/interfaces/client.type'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import type {
	Client as PrismaClient,
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
			email: client.email,
			document_type: client.documentType,
			document: client.document,
			birth_date: new Date(client.birthDate),
			phone: client.phone,
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
				email: raw.email,
				documentType: raw.document_type as DOCUMENT_TYPE.CPF | DOCUMENT_TYPE.RG,
				document: raw.document,
				birthDate: new Date(raw.birth_date),
				phone: raw.phone,
				companyId: new UniqueEntityID(raw.company_id),
				role: raw.role as ROLE.CLIENT,
				interviews: interviewList,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
