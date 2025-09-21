import { z } from 'zod'

export const cancelAppointmentParams = z.object({
	appointmentId: z.string().uuid(),
})

export type CancelAppointmentParams = z.infer<typeof cancelAppointmentParams>