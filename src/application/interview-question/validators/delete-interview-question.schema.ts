import { z } from 'zod'

export const deleteInterviewQuestionParams = z.object({
	questionId: z.string().uuid(),
})

export type DeleteInterviewQuestionParams = z.infer<typeof deleteInterviewQuestionParams>