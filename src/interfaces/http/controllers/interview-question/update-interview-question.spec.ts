import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import request from 'supertest'

describe('Update Interview Question (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update interview question', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		const question = await prisma.interviewQuestion.create({
			data: {
				question: 'Original question',
				options: ['Option 1', 'Option 2'],
				required: true,
			},
		})

		const response = await request(app.server)
			.put(`/interview-questions/${question.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				question: 'Updated question',
				options: ['New Option 1', 'New Option 2', 'New Option 3'],
				required: false,
			})

		expect(response.status).toEqual(204)

		// Verify the question was updated
		const updatedQuestion = await prisma.interviewQuestion.findUnique({
			where: { id: question.id },
		})

		expect(updatedQuestion).toEqual(
			expect.objectContaining({
				question: 'Updated question',
				options: ['New Option 1', 'New Option 2', 'New Option 3'],
				required: false,
			}),
		)
	})
})