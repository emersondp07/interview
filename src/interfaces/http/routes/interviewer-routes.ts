import { authenticateInterviewerSchema } from '@application/interviewer/validators/authenticate-interviewer.schema'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { authenticateInterviewer } from '../controllers/interviewer/authenticate-interviewer'

export async function interviewerRoutes(app: FastifyTypedInstance) {
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
