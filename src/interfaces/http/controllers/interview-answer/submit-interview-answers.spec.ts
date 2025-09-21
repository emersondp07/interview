import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Submit Interview Answers (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to submit interview answers', async () => {
		const { tokenClient, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test questions
		const question1 = await prisma.interviewQuestion.create({
			data: {
				question: 'How are you feeling?',
				options: ['Great', 'Good', 'Bad'],
				required: true,
			},
		})

		const question2 = await prisma.interviewQuestion.create({
			data: {
				question: 'Any symptoms?',
				options: ['Yes', 'No'],
				required: false,
			},
		})

		const response = await request(app.server)
			.post('/interview-answers')
			.set('Authorization', `Bearer ${tokenClient}`)
			.send({
				answers: [
					{
						questionId: question1.id,
						selectedOption: 'Good',
					},
					{
						questionId: question2.id,
						selectedOption: 'No',
					},
				],
			})

		expect(response.status).toEqual(201)

		// Verify answers were created
		const answers = await prisma.interviewAnswer.findMany({
			where: { client_id: clientId },
		})

		expect(answers).toHaveLength(2)
	})

	it('should not be able to submit answers without authentication', async () => {
		const response = await request(app.server)
			.post('/interview-answers')
			.send({
				answers: [
					{
						questionId: 'some-question-id',
						selectedOption: 'Some answer',
					},
				],
			})

		expect(response.status).toEqual(401)
	})
})