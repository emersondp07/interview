import { z } from 'zod'

export const registerCompanySchema = z.object({
	corporateReason: z.string().min(1, 'Corporate reason is required'),
	cnpj: z.string().min(11, 'CNPJ is required'),
	email: z.string().email('Invalid email format'),
	password: z
		.string()
		.min(8, 'A senha deve conter pelo menos 8 caracteres')
		.regex(/[A-Z]/, 'Deve conter uma letra maiúscula')
		.regex(/[a-z]/, 'Deve conter uma letra minúscula')
		.regex(/[0-9]/, 'Deve conter um número'),
	phone: z.string().min(1, 'Phone is required'),
	planId: z.string().uuid('Plan ID is required'),
})

export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>
