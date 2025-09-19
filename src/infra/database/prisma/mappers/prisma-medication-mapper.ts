import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { MEDICATION_FREQUENCY } from '@/domain/interviewer/entities/interfaces/medication.type'
import { Medication } from '@/domain/interviewer/entities/medication'
import type {
	Medication as PrismaMedication,
	MEDICATION_FREQUENCY as PrismaMedicationFrequency,
} from '@prisma/client'

export class PrismaMedicationMapper {
	static toPrisma(medication: Medication): PrismaMedication {
		return {
			id: medication.id.toString(),
			name: medication.name,
			dosage: medication.dosage,
			frequency: medication.frequency as PrismaMedicationFrequency,
			duration: medication.duration,
			instructions: medication.instructions ?? null,
			created_at: medication.createdAt,
			updated_at: medication.updatedAt,
			deleted_at: medication.deletedAt ?? null,
			prescription_id: medication.prescriptionId.toString(),
		}
	}

	static toDomain(raw: PrismaMedication): Medication {
		return Medication.create(
			{
				name: raw.name,
				dosage: raw.dosage,
				frequency: raw.frequency as MEDICATION_FREQUENCY,
				duration: raw.duration,
				instructions: raw.instructions ?? undefined,
				prescriptionId: new UniqueEntityID(raw.prescription_id),
				createdAt: raw.created_at,
				updatedAt: raw.updated_at ?? undefined,
				deletedAt: raw.deleted_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
