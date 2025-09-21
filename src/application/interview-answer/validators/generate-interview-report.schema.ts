import { z } from 'zod'

export const generateInterviewReportParams = z.object({
	interviewId: z.string().uuid(),
})

export type GenerateInterviewReportParams = z.infer<typeof generateInterviewReportParams>