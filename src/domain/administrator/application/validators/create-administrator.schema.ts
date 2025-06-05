import { z } from 'zod'

export const createAdministratorSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
})

export type CreateAdministratorSchema = z.infer<
	typeof createAdministratorSchema
>
