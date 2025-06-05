import { authenticateInterviewerSchema } from '@/domain/interviewer/application/validators/authenticate-interviewer.schema'
import type { FastifyInstance } from 'fastify'
import { authenticateInterviewer } from '../controllers/interviewer/authenticate-interviewer'

export async function interviewerRoutes(app: FastifyInstance) {
	app.post(
		'/session-interviewer',
		{
			schema: {
				tags: ['Interviewer'],
				summary: '',
				description: '',
				body: authenticateInterviewerSchema,
			},
		},
		authenticateInterviewer,
	)
}
