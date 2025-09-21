import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import request from 'supertest'

describe('Delete Interview Question (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete interview question', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		const question = await prisma.interviewQuestion.create({
			data: {
				question: 'Question to be deleted',
				options: ['Option 1', 'Option 2'],
				required: true,
			},
		})

		const response = await request(app.server)
			.delete(`/interview-questions/${question.id}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(204)

		// Verify the question was soft deleted
		const deletedQuestion = await prisma.interviewQuestion.findUnique({
			where: { id: question.id },
		})

		expect(deletedQuestion?.deleted_at).not.toBeNull()
	})
})