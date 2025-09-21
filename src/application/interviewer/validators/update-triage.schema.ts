import { z } from 'zod'

export const updateTriageParams = z.object({
	triageId: z.string().uuid(),
})

export const updateTriageSchema = z.object({
	notes: z.string().optional(),
	vitalSigns: z.record(z.any()).optional(),
	nurseName: z.string().min(1, 'Nurse name is required').optional(),
})

export type UpdateTriageParams = z.infer<typeof updateTriageParams>
export type UpdateTriageSchema = z.infer<typeof updateTriageSchema>