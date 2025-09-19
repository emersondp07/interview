import type { MEDICAL_RECORD_TYPE } from '@/domain/client/entities/interfaces/medical-history.type'
import { MedicalHistory } from '@/domain/client/entities/medical-history'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type {
	MedicalHistory as PrismaMedicalHistory,
	MEDICAL_RECORD_TYPE as PrismaMedicalRecordType,
} from '@prisma/client'

export class PrismaMedicalHistoryMapper {
	static toPrisma(medicalHistory: MedicalHistory): PrismaMedicalHistory {
		return {
			id: medicalHistory.id.toString(),
			type: medicalHistory.type as PrismaMedicalRecordType,
			title: medicalHistory.title,
			description: medicalHistory.description,
			date: medicalHistory.date,
			doctor_name: medicalHistory.doctorName ?? null,
			institution: medicalHistory.institution ?? null,
			files: medicalHistory.files,
			observations: medicalHistory.observations ?? null,
			created_at: medicalHistory.createdAt,
			updated_at: medicalHistory.updatedAt,
			deleted_at: medicalHistory.deletedAt ?? null,
			client_id: medicalHistory.clientId.toString(),
			interview_id: medicalHistory.interviewId?.toString() ?? null,
		}
	}

	static toDomain(raw: PrismaMedicalHistory): MedicalHistory {
		return MedicalHistory.create(
			{
				type: raw.type as MEDICAL_RECORD_TYPE,
				title: raw.title,
				description: raw.description,
				date: raw.date,
				doctorName: raw.doctor_name ?? undefined,
				institution: raw.institution ?? undefined,
				files: raw.files,
				observations: raw.observations ?? undefined,
				clientId: new UniqueEntityID(raw.client_id),
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
