import { SPECIALTIES } from '@/domain/interviewer/entities/interfaces/interviewer.type'
import { z } from 'zod'

export const createAppointmentSchema = z.object({
	clientId: z.string().uuid(),
	specialty: z.string().toUpperCase().pipe(z.nativeEnum(SPECIALTIES)),
	scheduledAt: z.coerce.date(),
})

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>