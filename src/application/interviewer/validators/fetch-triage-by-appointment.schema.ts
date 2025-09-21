import { z } from 'zod'

export const fetchTriageByAppointmentParams = z.object({
	appointmentId: z.string().uuid(),
})

export type FetchTriageByAppointmentParams = z.infer<typeof fetchTriageByAppointmentParams>