import { z } from 'zod'

const getCompanySchema = z.object({
	companyId: z.string().min(1, 'Company ID is required'),
})

export type GetCompanySchema = z.infer<typeof getCompanySchema>
