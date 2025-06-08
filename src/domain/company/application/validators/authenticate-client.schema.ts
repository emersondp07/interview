import { z } from 'zod'

export const authenticateCompanySchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type AuthenticateCompanySchema = z.infer<
	typeof authenticateCompanySchema
>
