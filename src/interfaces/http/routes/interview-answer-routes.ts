import { fetchAnswersByInterviewParams } from '@/application/interview-answer/validators/fetch-answers-by-interview.schema'
import { fetchClientAnswersParams } from '@/application/interview-answer/validators/fetch-client-answers.schema'
import { generateInterviewReportParams } from '@/application/interview-answer/validators/generate-interview-report.schema'
import { submitInterviewAnswersSchema } from '@/application/interview-answer/validators/submit-interview-answers.schema'
import { updateInterviewAnswerParams, updateInterviewAnswerSchema } from '@/application/interview-answer/validators/update-interview-answer.schema'
import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { fetchAnswersByInterview } from '../controllers/interview-answer/fetch-answers-by-interview'
import { fetchClientAnswers } from '../controllers/interview-answer/fetch-client-answers'
import { generateInterviewReport } from '../controllers/interview-answer/generate-interview-report'
import { submitInterviewAnswers } from '../controllers/interview-answer/submit-interview-answers'
import { updateInterviewAnswer } from '../controllers/interview-answer/update-interview-answer'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function interviewAnswerRoutes(app: FastifyTypedInstance) {
	app.post(
		'/interview-answers',
		{
			schema: {
				tags: ['Interview Answers'],
				summary: 'Submit interview answers',
				description: 'This route allows a client to submit their interview answers.',
				body: submitInterviewAnswersSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.CLIENT])],
		},
		submitInterviewAnswers,
	)

	app.get(
		'/clients/:clientId/answers',
		{
			schema: {
				tags: ['Interview Answers'],
				summary: 'Fetch client answers',
				description: 'This route allows fetching all answers from a specific client.',
				params: fetchClientAnswersParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		fetchClientAnswers,
	)

	app.get(
		'/interviews/:interviewId/answers',
		{
			schema: {
				tags: ['Interview Answers'],
				summary: 'Fetch answers by interview',
				description: 'This route allows fetching all answers for a specific interview.',
				params: fetchAnswersByInterviewParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		fetchAnswersByInterview,
	)

	app.put(
		'/interview-answers/:answerId',
		{
			schema: {
				tags: ['Interview Answers'],
				summary: 'Update interview answer',
				description: 'This route allows updating a specific interview answer.',
				params: updateInterviewAnswerParams,
				body: updateInterviewAnswerSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.CLIENT])],
		},
		updateInterviewAnswer,
	)

	app.get(
		'/interviews/:interviewId/report',
		{
			schema: {
				tags: ['Interview Answers'],
				summary: 'Generate interview report',
				description: 'This route generates a comprehensive report for a specific interview.',
				params: generateInterviewReportParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		generateInterviewReport,
	)
}