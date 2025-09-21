import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { PRESCRIPTION_STATUS } from '@/domain/interviewer/entities/interfaces/prescription.type'
import { Prescription } from '@/domain/interviewer/entities/prescription'
import type {
	Prescription as PrismaPrescription,
	PRESCRIPTION_STATUS as PrismaPrescriptionStatus,
} from '@prisma/client'

export class PrismaPrescriptionMapper {
	static toPrisma(prescription: Prescription): PrismaPrescription {
		return {
			id: prescription.id.toString(),
			status: prescription.status as PrismaPrescriptionStatus,
			diagnosis: prescription.diagnosis,
			instructions: prescription.instructions ?? null,
			created_at: prescription.createdAt,
			updated_at: prescription.updatedAt,
			deleted_at: prescription.deletedAt ?? null,
			client_id: prescription.clientId.toString(),
			interviewer_id: prescription.interviewerId.toString(),
			interview_id: prescription.interviewId?.toString() ?? null,
		}
	}

	static toDomain(raw: PrismaPrescription): Prescription {
		return Prescription.create(
			{
				status: raw.status as PRESCRIPTION_STATUS,
				diagnosis: raw.diagnosis,
				instructions: raw.instructions ?? undefined,
				clientId: new UniqueEntityID(raw.client_id),
				interviewerId: new UniqueEntityID(raw.interviewer_id),
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
