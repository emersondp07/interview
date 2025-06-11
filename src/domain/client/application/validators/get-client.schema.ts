import { z } from 'zod'

export const getClientSchema = z.object({
	clientId: z.string().min(1, 'Client ID is required'),
})

export type GetClientSchema = z.infer<typeof getClientSchema>
