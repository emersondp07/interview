import {
	PROFESSIONAL_REGISTRATIONS,
	SPECIALTIES,
} from '@/domain/interviewer/entities/interfaces/interviewer.type'
import { z } from 'zod'

export const createInterviewerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
	specialty: z.string().toUpperCase().pipe(z.nativeEnum(SPECIALTIES)),
	profissionalRegistration: z
		.string()
		.toUpperCase()
		.pipe(z.nativeEnum(PROFESSIONAL_REGISTRATIONS)),
	numberRegistration: z.string().min(1, 'Number registration is required'),
	experience: z.string().optional(),
	bio: z.string().min(1, 'Bio is required'),
})

export type CreateInterviewerSchema = z.infer<typeof createInterviewerSchema>
