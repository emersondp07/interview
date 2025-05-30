import { z } from 'zod'

export const createContractSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	imageUrl: z.string().url('Invalid URL format'),
	companyId: z.string().uuid('Invalid company ID format'),
})

export type CreateContractSchema = z.infer<typeof createContractSchema>
