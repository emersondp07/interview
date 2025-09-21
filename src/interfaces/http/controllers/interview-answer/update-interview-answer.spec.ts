import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Update Interview Answer (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update interview answer', async () => {
		const { tokenClient, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		// Create test question
		const question = await prisma.interviewQuestion.create({
			data: {
				question: 'Test question',
				options: ['Option 1', 'Option 2', 'Option 3'],
				required: true,
			},
		})

		// Create test answer
		const answer = await prisma.interviewAnswer.create({
			data: {
				client_id: clientId,
				question_id: question.id,
				selected_option: 'Option 1',
			},
		})

		const response = await request(app.server)
			.put(`/interview-answers/${answer.id}`)
			.set('Authorization', `Bearer ${tokenClient}`)
			.send({
				selectedOption: 'Option 2',
			})

		expect(response.status).toEqual(204)

		// Verify the answer was updated
		const updatedAnswer = await prisma.interviewAnswer.findUnique({
			where: { id: answer.id },
		})

		expect(updatedAnswer?.selected_option).toBe('Option 2')
	})
})