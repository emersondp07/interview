import { z } from 'zod'

export const deleteInterviewerParams = z.object({
	interviewerId: z.string().uuid('Interviewer ID is required'),
})

export type DeleteInterviewerParams = z.infer<typeof deleteInterviewerParams>
