import { z } from 'zod'

export const fetchClientsSchema = z.object({
	page: z.coerce.number().min(1, 'Page must be greater than 0').default(1),
})

export type FetchClientsSchema = z.infer<typeof fetchClientsSchema>
