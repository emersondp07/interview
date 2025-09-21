import { z } from 'zod'

export const fetchAppointmentsByClientParams = z.object({
	clientId: z.string().uuid(),
})

export type FetchAppointmentsByClientParams = z.infer<typeof fetchAppointmentsByClientParams>