import { z } from 'zod'

export const cancelInvoiceParams = z.object({
	invoiceId: z.string().uuid('Invalid invoice ID format'),
	signatureId: z.string().uuid('Invalid signature ID format'),
})

export type CancelInvoiceParams = z.infer<typeof cancelInvoiceParams>
