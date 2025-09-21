import { z } from 'zod'

export const fetchAnswersByInterviewParams = z.object({
	interviewId: z.string().uuid(),
})

export type FetchAnswersByInterviewParams = z.infer<typeof fetchAnswersByInterviewParams>