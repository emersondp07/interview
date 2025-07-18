import { z } from 'zod'

export const fetchPlansSchema = z.object({
	page: z.coerce.number().min(1, 'Page must be greater than 0').default(1),
})

export type FetchPlansSchema = z.infer<typeof fetchPlansSchema>
