import { VitalSigns } from '@/domain/client/entities/vital-signs'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { VitalSigns as PrismaVitalSigns } from '@prisma/client'

export class PrismaVitalSignsMapper {
	static toPrisma(vitalSigns: VitalSigns): PrismaVitalSigns {
		return {
			id: vitalSigns.id.toString(),
			systolic_pressure: vitalSigns.systolicPressure ?? null,
			diastolic_pressure: vitalSigns.diastolicPressure ?? null,
			heart_rate: vitalSigns.heartRate ?? null,
			temperature: vitalSigns.temperature ?? null,
			weight: vitalSigns.weight ?? null,
			height: vitalSigns.height ?? null,
			respiratory_rate: vitalSigns.respiratoryRate ?? null,
			oxygen_saturation: vitalSigns.oxygenSaturation ?? null,
			glucose: vitalSigns.glucose ?? null,
			observations: vitalSigns.observations ?? null,
			measured_at: vitalSigns.measuredAt,
			created_at: vitalSigns.createdAt,
			updated_at: vitalSigns.updatedAt ?? null,
			deleted_at: vitalSigns.deletedAt ?? null,
			client_id: vitalSigns.clientId.toString(),
			interview_id: vitalSigns.interviewId?.toString() ?? null,
		}
	}

	static toDomain(raw: PrismaVitalSigns): VitalSigns {
		return VitalSigns.create(
			{
				systolicPressure: raw.systolic_pressure ?? undefined,
				diastolicPressure: raw.diastolic_pressure ?? undefined,
				heartRate: raw.heart_rate ?? undefined,
				temperature: raw.temperature ?? undefined,
				weight: raw.weight ?? undefined,
				height: raw.height ?? undefined,
				respiratoryRate: raw.respiratory_rate ?? undefined,
				oxygenSaturation: raw.oxygen_saturation ?? undefined,
				glucose: raw.glucose ?? undefined,
				observations: raw.observations ?? undefined,
				measuredAt: raw.measured_at,
				clientId: new UniqueEntityID(raw.client_id),
				interviewId: raw.interview_id
					? new UniqueEntityID(raw.interview_id)
					: undefined,
				createdAt: raw.created_at,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
