import {
	DOCUMENT_TYPE,
	GENDER,
} from '@/domain/client/entities/interfaces/client.type'
import { z } from 'zod'

export const registerClientSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	documentType: z.string().toUpperCase().pipe(z.nativeEnum(DOCUMENT_TYPE)),
	document: z.string().min(1, 'Document is required'),
	phone: z.string().min(1, 'Phone is required'),
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
	age: z.number().min(1, 'Age is required'),
	gender: z.string().toUpperCase().pipe(z.nativeEnum(GENDER)),
	email: z.string().email('Invalid email format'),
	emergencyContact: z.string().optional(),
	emergencyPhone: z.string().optional(),
	medicalHistory: z.string().optional(),
	allergies: z.string().optional(),
	medications: z.string().optional(),
})

export type RegisterClientSchema = z.infer<typeof registerClientSchema>
