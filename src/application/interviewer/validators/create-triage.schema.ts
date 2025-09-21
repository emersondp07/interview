import { z } from 'zod'

export const createTriageSchema = z.object({
	clientId: z.string().uuid(),
	notes: z.string().optional(),
	vitalSigns: z.record(z.any()).optional(),
	nurseName: z.string().min(1, 'Nurse name is required'),
})

export type CreateTriageSchema = z.infer<typeof createTriageSchema>