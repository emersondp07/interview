import { z } from 'zod'

const fetchInterviews = z.object({
	page: z.coerce.number().min(1, 'Page must be greater than 0'),
})

export type FetchInterviewsSchema = z.infer<typeof fetchInterviews>
