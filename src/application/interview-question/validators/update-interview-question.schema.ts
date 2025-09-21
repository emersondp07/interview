import { z } from 'zod'

export const updateInterviewQuestionParams = z.object({
	questionId: z.string().uuid(),
})

export const updateInterviewQuestionSchema = z.object({
	question: z.string().min(1, 'Question is required').optional(),
	options: z.array(z.string()).min(1, 'At least one option is required').optional(),
	required: z.boolean().optional(),
})

export type UpdateInterviewQuestionParams = z.infer<typeof updateInterviewQuestionParams>
export type UpdateInterviewQuestionSchema = z.infer<typeof updateInterviewQuestionSchema>