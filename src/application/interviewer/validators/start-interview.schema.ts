import { z } from 'zod'

const startInterview = z.object({
	clientId: z.string().uuid('Invalid client ID format'),
	interviewId: z.string().uuid('Invalid company ID format'),
	interviewerId: z.string().uuid('Invalid interviewer ID format'),
})

export type StartInterviewSchema = z.infer<typeof startInterview>
