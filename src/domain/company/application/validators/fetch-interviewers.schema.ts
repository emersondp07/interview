import { z } from 'zod'

const fetchInterviewers = z.object({
	page: z.number().min(1, 'Page must be greater than 0'),
})

export type FetchInterviewersSchema = z.infer<typeof fetchInterviewers>
