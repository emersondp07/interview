import { z } from 'zod'

export const createInterviewerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type CreateInterviewerSchema = z.infer<typeof createInterviewerSchema>
