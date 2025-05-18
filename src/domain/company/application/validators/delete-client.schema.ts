import { z } from 'zod'

const deleteClient = z.object({
	clientId: z.string().uuid('Client ID is required'),
})

export type DeleteClientSchema = z.infer<typeof deleteClient>
