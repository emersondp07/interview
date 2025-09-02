import { authenticateInterviewerSchema } from '@application/interviewer/validators/authenticate-interviewer.schema'
import { getInterviewSchema } from '../../../application/client/validators/get-interview.schema'
import { ROLE } from '../../../domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { authenticateInterviewer } from '../controllers/interviewer/authenticate-interviewer'
import { getInterview } from '../controllers/interviewer/get-interview'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

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

	app.get(
		'/get-interview/:interviewId',
		{
			schema: {
				tags: ['Interviewer'],
				summary: 'Get interview by ID',
				description: 'This route allows a company to get a interview by ID.',
				params: getInterviewSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.CLIENT, ROLE.INTERVIEWER])],
		},
		getInterview,
	)
}
