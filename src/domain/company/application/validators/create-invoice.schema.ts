import { z } from 'zod'
import { STATUS_PAYMENT } from '../../enterprise/entities/interfaces/invoice.type'

const createInvoice = z.object({
	mounth: z.string().min(1, 'Mounth is required'),
	value: z.string().min(1, 'Value is required'),
	status: z.string().toUpperCase().pipe(z.nativeEnum(STATUS_PAYMENT)),
	signatureId: z.string().uuid('Signature ID is required'),
})

export type CreateInvoiceSchema = z.infer<typeof createInvoice>
