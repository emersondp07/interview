import { z } from 'zod'

const sendContract = z.object({
	clientId: z.string().uuid('Invalid client ID format'),
	interviewId: z.string().uuid('Invalid company ID format'),
})

export type SendContractSchema = z.infer<typeof sendContract>
