import { z } from 'zod'

const createPlanSchema = z.object({
	planName: z.string().min(1, 'Plan name is required'),
	planPrice: z.string().min(1, 'Plan price is required'),
	planDescription: z.string().min(1, 'Plan description is required'),
	planInterviewLimit: z.number().min(1, 'Plan interview limit is required'),
})

export type CreatePlanSchema = z.infer<typeof createPlanSchema>
