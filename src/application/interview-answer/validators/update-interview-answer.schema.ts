import { z } from 'zod'

export const updateInterviewAnswerParams = z.object({
	answerId: z.string().uuid(),
})

export const updateInterviewAnswerSchema = z.object({
	selectedOption: z.string().min(1, 'Selected option is required'),
})

export type UpdateInterviewAnswerParams = z.infer<typeof updateInterviewAnswerParams>
export type UpdateInterviewAnswerSchema = z.infer<typeof updateInterviewAnswerSchema>