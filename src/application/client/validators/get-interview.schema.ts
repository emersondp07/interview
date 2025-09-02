import { z } from 'zod'

export const getInterviewSchema = z.object({
	interviewId: z.string().min(1, 'Interview ID is required'),
})

export type GetInterviewSchema = z.infer<typeof getInterviewSchema>
