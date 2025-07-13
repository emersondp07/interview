import { z } from 'zod'

export const createInvoiceSchema = z.object({
	mounth: z.string().min(1, 'Mounth is required'),
	value: z.string().min(1, 'Value is required'),
	companyId: z.string().min(1, 'Value is required'),
	stripeInvoiceId: z.string().uuid('Signature ID is required'),
})

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>
