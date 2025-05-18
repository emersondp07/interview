import { z } from 'zod'

const registerCompany = z.object({
	corporateReason: z.string().min(1, 'Corporate reason is required'),
	cnpj: z.string().min(1, 'CNPJ is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
	phone: z.string().min(1, 'Phone is required'),
	planId: z.string().uuid('Plan ID is required'),
})

export type RegisterCompanySchema = z.infer<typeof registerCompany>
