import { z } from 'zod'

export const getCompanySchema = z.object({
	companyId: z.string().min(1, 'Company ID is required'),
})

export type GetCompanySchema = z.infer<typeof getCompanySchema>
