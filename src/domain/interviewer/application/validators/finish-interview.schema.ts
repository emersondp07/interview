import { z } from 'zod'

const finishInterview = z.object({
	clientId: z.string().uuid('Invalid client ID format'),
	interviewId: z.string().uuid('Invalid interview ID format'),
})

export type FinishInteviewSchema = z.infer<typeof finishInterview>
