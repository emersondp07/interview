import { z } from 'zod'

export const deleteClientParams = z.object({
	clientId: z.string().uuid('Client ID is required'),
})

export type DeleteClientParams = z.infer<typeof deleteClientParams>
