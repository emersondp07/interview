import { z } from 'zod'

export const fetchInterviewQuestionsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
})

export type FetchInterviewQuestionsSchema = z.infer<typeof fetchInterviewQuestionsSchema>