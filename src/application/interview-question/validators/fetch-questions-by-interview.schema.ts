import { z } from 'zod'

export const fetchQuestionsByInterviewParams = z.object({
	interviewId: z.string().uuid(),
})

export type FetchQuestionsByInterviewParams = z.infer<typeof fetchQuestionsByInterviewParams>