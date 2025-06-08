import { authenticateInterviewerSchema } from '@/domain/interviewer/application/validators/authenticate-interviewer.schema'
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

	// app.post(
	// 	'/fetch-interviews',
	// 	{
	// 		schema: {
	// 			tags: ['Interviewer'],
	// 			summary: '',
	// 			description: '',
	// 			body: authenticateInterviewerSchema,
	// 		},
	// 	},
	// 	authenticateInterviewer,
	// )
}
