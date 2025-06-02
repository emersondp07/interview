import { z } from 'zod'
import { DOCUMENT_TYPE } from '../../../client/enterprise/entities/interfaces/client.type'

export const registerClientSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	documentType: z.string().toUpperCase().pipe(z.nativeEnum(DOCUMENT_TYPE)),
	document: z.string().min(1, 'Document is required'),
	birthDate: z
		.string()
		.transform((val) => new Date(val))
		.refine(
			(date) => {
				return date <= new Date()
			},
			{
				message: 'Birth date must be in the past',
			},
		),
	phone: z.string().min(1, 'Phone is required'),
	email: z.string().email('Invalid email format'),
	companyId: z.string().uuid('Company ID is required'),
})

export type RegisterClientSchema = z.infer<typeof registerClientSchema>
