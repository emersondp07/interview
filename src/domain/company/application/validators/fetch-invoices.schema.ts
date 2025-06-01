import { z } from 'zod'

export const fetchInvoicesSchema = z.object({
	page: z.number().min(1, 'Page must be greater than 0').default(1),
})

export type FetchInvoicesSchema = z.infer<typeof fetchInvoicesSchema>
