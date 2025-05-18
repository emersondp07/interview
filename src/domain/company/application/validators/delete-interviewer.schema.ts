import { z } from 'zod'

const deleteInterviewer = z.object({
	interviewerId: z.string().uuid('Interviewer ID is required'),
	companyId: z.string().uuid('Company ID is required'),
})

export type DeleteInterviewerSchema = z.infer<typeof deleteInterviewer>
