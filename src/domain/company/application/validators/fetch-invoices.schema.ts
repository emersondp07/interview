import { z } from 'zod'

const fetchInvoices = z.object({
	page: z.number().min(1, 'Page must be greater than 0'),
})

export type FetchInvoicesSchema = z.infer<typeof fetchInvoices>
