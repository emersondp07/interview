import { z } from 'zod'

export const getInterviewerSchema = z.object({
	interviewerId: z.string().min(1, 'Client ID is required'),
})

export type GetInterviewerSchema = z.infer<typeof getInterviewerSchema>
