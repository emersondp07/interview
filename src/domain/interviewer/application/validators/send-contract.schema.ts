import { z } from 'zod'

const sendContract = z.object({
	interviewId: z.string().uuid('Invalid company ID format'),
})

export type SendContractSchema = z.infer<typeof sendContract>
