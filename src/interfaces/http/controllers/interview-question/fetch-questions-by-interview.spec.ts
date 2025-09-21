import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Fetch Questions by Interview (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch questions by interview', async () => {
		const { tokenInterviewer, interviewId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test questions linked to the interview
		await prisma.interviewQuestion.create({
			data: {
				question: 'Interview specific question 1',
				options: ['Yes', 'No'],
				required: true,
				interview_id: interviewId,
			},
		})

		await prisma.interviewQuestion.create({
			data: {
				question: 'Interview specific question 2',
				options: ['Option A', 'Option B', 'Option C'],
				required: false,
				interview_id: interviewId,
			},
		})

		const response = await request(app.server)
			.get(`/interviews/${interviewId}/questions`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body.interviewQuestions).toHaveLength(2)
		expect(response.body.interviewQuestions[0]).toEqual(
			expect.objectContaining({
				question: expect.any(String),
				options: expect.any(Array),
			}),
		)
	})
})