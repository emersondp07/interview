import { Appointment } from '@/domain/client/entities/appointment'
import type {
	SPECIALTIES,
	STATUS_APPOINTMENT,
} from '@/domain/client/entities/interfaces/appointment.type'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type {
	Appointment as PrismaAppointment,
	SPECIALTIES as PrismaSpecialties,
	STATUS_APPOINTMENT as PrismaStatusAppointment,
} from '@prisma/client'

export class PrismaAppointmentMapper {
	static toPrisma(appointment: Appointment): PrismaAppointment {
		return {
			id: appointment.id.toString(),
			status: appointment.status as PrismaStatusAppointment,
			scheduled_at: appointment.scheduledAt,
			created_at: appointment.createdAt,
			updated_at: appointment.updatedAt,
			deleted_at: appointment.deletedAt ?? null,
			client_id: appointment.clientId.toString(),
			interviewer_id: appointment.interviewerId?.toString() ?? null,
			specialty: appointment.specialty as PrismaSpecialties,
			triage_id: appointment.triageId?.toString() ?? null,
			interview_id: appointment.interviewId?.toString() ?? null,
		}
	}

	static toDomain(raw: PrismaAppointment): Appointment {
		return Appointment.create(
			{
				status: raw.status as STATUS_APPOINTMENT,
				scheduledAt: raw.scheduled_at,
				clientId: new UniqueEntityID(raw.client_id),
				interviewerId: raw.interviewer_id
					? new UniqueEntityID(raw.interviewer_id)
					: undefined,
				specialty: raw.specialty as SPECIALTIES,
				triageId: raw.triage_id ? new UniqueEntityID(raw.triage_id) : undefined,
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
