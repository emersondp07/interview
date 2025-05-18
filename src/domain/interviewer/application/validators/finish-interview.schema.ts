import { z } from 'zod'

const finishInterview = z.object({
	interviewId: z.string().uuid('Invalid company ID format'),
})

export type FinishInteviewSchema = z.infer<typeof finishInterview>
