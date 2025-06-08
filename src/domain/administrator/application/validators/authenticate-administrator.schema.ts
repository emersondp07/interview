import { z } from 'zod'

export const authenticateAdministratorSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type AuthenticateAdministratorSchema = z.infer<
	typeof authenticateAdministratorSchema
>
