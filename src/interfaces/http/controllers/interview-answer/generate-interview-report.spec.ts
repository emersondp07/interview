import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Generate Interview Report (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to generate interview report', async () => {
		const { tokenInterviewer, clientId, interviewId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test questions and answers
		const question1 = await prisma.interviewQuestion.create({
			data: {
				question: 'How do you feel?',
				options: ['Great', 'Good', 'Bad'],
				required: true,
				interview_id: interviewId,
			},
		})

		const question2 = await prisma.interviewQuestion.create({
			data: {
				question: 'Any pain?',
				options: ['Yes', 'No'],
				required: true,
				interview_id: interviewId,
			},
		})

		await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question1.id,
				selected_option: 'Good',
			},
		})

		await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question2.id,
				selected_option: 'No',
			},
		})

		const response = await request(app.server)
			.get(`/interviews/${interviewId}/report`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body).toEqual(
			expect.objectContaining({
				report: expect.any(Object),
			}),
		)
	})
})