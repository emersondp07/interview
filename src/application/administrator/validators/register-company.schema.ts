import { z } from 'zod'

export const registerCompanySchema = z.object({
	corporateReason: z.string().min(1, 'Corporate reason is required'),
	cnpj: z.string().min(11, 'CNPJ is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
	phone: z.string().min(1, 'Phone is required'),
	planId: z.string().uuid('Plan ID is required'),
})

export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>
