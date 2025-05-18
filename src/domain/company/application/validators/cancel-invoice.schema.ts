import { z } from 'zod'

const cancelInvoice = z.object({
	invoiceId: z.string().uuid('Invalid invoice ID format'),
	signatureId: z.string().uuid('Invalid signature ID format'),
})

export type CancelInvoiceSchema = z.infer<typeof cancelInvoice>
