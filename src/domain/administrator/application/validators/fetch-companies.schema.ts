import { z } from 'zod'

const fetchCompaniesSchema = z.object({
	page: z.number().min(1, 'Page must be greater than 0'),
})

export type FetchCompaniesSchema = z.infer<typeof fetchCompaniesSchema>
