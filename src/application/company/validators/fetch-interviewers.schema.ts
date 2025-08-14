import { z } from 'zod'

export const fetchInterviewersSchema = z.object({
	page: z.coerce.number().min(1, 'Page must be greater than 0').default(1),
})

export type FetchInterviewersSchema = z.infer<typeof fetchInterviewersSchema>
