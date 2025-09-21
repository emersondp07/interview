import { z } from 'zod'

export const createInterviewQuestionSchema = z.object({
	question: z.string().min(1, 'Question is required'),
	options: z.array(z.string()).min(1, 'At least one option is required'),
	required: z.boolean().optional().default(true),
})

export type CreateInterviewQuestionSchema = z.infer<typeof createInterviewQuestionSchema>