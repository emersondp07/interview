import { z } from 'zod'

const startInterview = z.object({
	interviewId: z.string().uuid('Invalid company ID format'),
})

export type StartInterviewSchema = z.infer<typeof startInterview>
