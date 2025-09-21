import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Fetch Answers by Interview (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch answers by interview', async () => {
		const { tokenInterviewer, clientId, interviewId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test question
		const question = await prisma.interviewQuestion.create({
			data: {
				question: 'Interview question',
				options: ['Yes', 'No'],
				required: true,
				interview_id: interviewId,
			},
		})

		// Create test answer linked to the interview
		await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question.id,
				selected_option: 'Yes',
			},
		})

		const response = await request(app.server)
			.get(`/interviews/${interviewId}/answers`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body.interviewAnswers).toHaveLength(1)
		expect(response.body.interviewAnswers[0]).toEqual(
			expect.objectContaining({
				selectedOption: 'Yes',
			}),
		)
	})
})