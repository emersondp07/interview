import { z } from 'zod'

export const authenticateClientSchema = z.object({
	document: z.string().min(11, 'Document must be at least 11 characters long'),
})

export type AuthenticateClientSchema = z.infer<typeof authenticateClientSchema>
