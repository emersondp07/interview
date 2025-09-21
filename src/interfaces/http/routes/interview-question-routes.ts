import { createInterviewQuestionSchema } from '@/application/interview-question/validators/create-interview-question.schema'
import { deleteInterviewQuestionParams } from '@/application/interview-question/validators/delete-interview-question.schema'
import { fetchInterviewQuestionsSchema } from '@/application/interview-question/validators/fetch-interview-questions.schema'
import { fetchQuestionsByInterviewParams } from '@/application/interview-question/validators/fetch-questions-by-interview.schema'
import { updateInterviewQuestionParams, updateInterviewQuestionSchema } from '@/application/interview-question/validators/update-interview-question.schema'
import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { createInterviewQuestion } from '../controllers/interview-question/create-interview-question'
import { deleteInterviewQuestion } from '../controllers/interview-question/delete-interview-question'
import { fetchInterviewQuestions } from '../controllers/interview-question/fetch-interview-questions'
import { fetchQuestionsByInterview } from '../controllers/interview-question/fetch-questions-by-interview'
import { updateInterviewQuestion } from '../controllers/interview-question/update-interview-question'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function interviewQuestionRoutes(app: FastifyTypedInstance) {
	app.post(
		'/interview-questions',
		{
			schema: {
				tags: ['Interview Questions'],
				summary: 'Create a new interview question',
				description: 'This route allows creating a new interview question.',
				body: createInterviewQuestionSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.ADMIN, ROLE.COMPANY])],
		},
		createInterviewQuestion,
	)

	app.get(
		'/interview-questions',
		{
			schema: {
				tags: ['Interview Questions'],
				summary: 'Fetch all interview questions',
				description: 'This route allows fetching all interview questions.',
				querystring: fetchInterviewQuestionsSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.ADMIN, ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		fetchInterviewQuestions,
	)

	app.get(
		'/interviews/:interviewId/questions',
		{
			schema: {
				tags: ['Interview Questions'],
				summary: 'Fetch questions by interview',
				description: 'This route allows fetching questions for a specific interview.',
				params: fetchQuestionsByInterviewParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.INTERVIEWER, ROLE.CLIENT])],
		},
		fetchQuestionsByInterview,
	)

	app.put(
		'/interview-questions/:questionId',
		{
			schema: {
				tags: ['Interview Questions'],
				summary: 'Update an interview question',
				description: 'This route allows updating an interview question.',
				params: updateInterviewQuestionParams,
				body: updateInterviewQuestionSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.ADMIN, ROLE.COMPANY])],
		},
		updateInterviewQuestion,
	)

	app.delete(
		'/interview-questions/:questionId',
		{
			schema: {
				tags: ['Interview Questions'],
				summary: 'Delete an interview question',
				description: 'This route allows deleting an interview question.',
				params: deleteInterviewQuestionParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.ADMIN, ROLE.COMPANY])],
		},
		deleteInterviewQuestion,
	)
}