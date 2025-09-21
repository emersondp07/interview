import { z } from 'zod'

const STATUS_APPOINTMENT = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'])

export const updateAppointmentStatusParams = z.object({
	appointmentId: z.string().uuid(),
})

export const updateAppointmentStatusSchema = z.object({
	status: STATUS_APPOINTMENT,
})

export type UpdateAppointmentStatusParams = z.infer<typeof updateAppointmentStatusParams>
export type UpdateAppointmentStatusSchema = z.infer<typeof updateAppointmentStatusSchema>