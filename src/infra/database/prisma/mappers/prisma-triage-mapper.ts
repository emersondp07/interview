import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Triage } from '@/domain/interviewer/entities/triage'
import type { Triage as PrismaTriage } from '@prisma/client'

export class PrismaTriageMapper {
	static toPrisma(triage: Triage): PrismaTriage {
		return {
			id: triage.id.toString(),
			notes: triage.notes ?? null,
			vital_signs: triage.vitalSigns ?? null,
			nurse_name: triage.nurseName,
			created_at: triage.createdAt,
			updated_at: triage.updatedAt,
			deleted_at: triage.deletedAt ?? null,
			client_id: triage.clientId.toString(),
		}
	}

	static toDomain(raw: PrismaTriage): Triage {
		return Triage.create(
			{
				notes: raw.notes ?? undefined,
				vitalSigns: raw.vital_signs ?? undefined,
				nurseName: raw.nurse_name,
				clientId: new UniqueEntityID(raw.client_id),
				createdAt: raw.created_at,
				updatedAt: raw.updated_at ?? undefined,
				deletedAt: raw.deleted_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
