import { DOCUMENT_TYPE } from '@/domain/client/entities/interfaces/client.type'
import { z } from 'zod'

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
})

export type RegisterClientSchema = z.infer<typeof registerClientSchema>
