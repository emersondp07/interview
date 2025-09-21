import { z } from 'zod'

export const fetchClientTriagesParams = z.object({
	clientId: z.string().uuid(),
})

export type FetchClientTriagesParams = z.infer<typeof fetchClientTriagesParams>