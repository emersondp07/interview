import { z } from 'zod'

export const fetchClientAnswersParams = z.object({
	clientId: z.string().uuid(),
})

export type FetchClientAnswersParams = z.infer<typeof fetchClientAnswersParams>