import { z } from 'zod'

export const submitInterviewAnswersSchema = z.object({
	answers: z.array(z.object({
		questionId: z.string().uuid(),
		selectedOption: z.string().min(1, 'Selected option is required'),
	})).min(1, 'At least one answer is required'),
})

export type SubmitInterviewAnswersSchema = z.infer<typeof submitInterviewAnswersSchema>