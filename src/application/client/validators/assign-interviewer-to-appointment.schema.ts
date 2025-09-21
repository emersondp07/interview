import { z } from 'zod'

export const assignInterviewerToAppointmentParams = z.object({
	appointmentId: z.string().uuid(),
})

export const assignInterviewerToAppointmentSchema = z.object({
	interviewerId: z.string().uuid(),
})

export type AssignInterviewerToAppointmentParams = z.infer<typeof assignInterviewerToAppointmentParams>
export type AssignInterviewerToAppointmentSchema = z.infer<typeof assignInterviewerToAppointmentSchema>