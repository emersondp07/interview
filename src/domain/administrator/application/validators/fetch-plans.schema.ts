import { z } from 'zod'

export const fetchPlansSchema = z.object({
	page: z.number().min(1, 'Page must be greater than 0'),
})

export type FetchPlansSchema = z.infer<typeof fetchPlansSchema>
