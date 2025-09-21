import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Fetch Client Answers (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch client answers', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test question
		const question = await prisma.interviewQuestion.create({
			data: {
				question: 'Test question',
				options: ['Answer 1', 'Answer 2'],
				required: true,
			},
		})

		// Create test answers
		await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question.id,
				selected_option: 'Answer 1',
			},
		})

		await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question.id,
				selected_option: 'Answer 2',
			},
		})

		const response = await request(app.server)
			.get(`/clients/${clientId}/answers`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)

		expect(response.status).toEqual(200)
		expect(response.body.interviewAnswers).toHaveLength(2)
		expect(response.body.interviewAnswers[0]).toEqual(
			expect.objectContaining({
				selectedOption: expect.any(String),
			}),
		)
	})
})