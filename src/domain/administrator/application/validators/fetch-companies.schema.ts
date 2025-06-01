import { z } from 'zod'

export const fetchCompaniesSchema = z.object({
	page: z.number().min(1, 'Page must be greater than 0').default(1),
})

export type FetchCompaniesSchema = z.infer<typeof fetchCompaniesSchema>
