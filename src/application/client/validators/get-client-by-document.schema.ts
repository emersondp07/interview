import { z } from 'zod'

export const getClientByDocumentSchema = z.object({
	document: z.string().min(1, 'Client ID is required'),
})

export type GetClientByDocumentSchema = z.infer<
	typeof getClientByDocumentSchema
>
