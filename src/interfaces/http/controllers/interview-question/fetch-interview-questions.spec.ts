import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import request from 'supertest'

describe('Fetch Interview Questions (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch interview questions', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		// Create test questions
		await prisma.interviewQuestion.create({
			data: {
				question: 'How are you feeling today?',
				options: ['Great', 'Good', 'Okay', 'Bad'],
				required: true,
			},
		})

		await prisma.interviewQuestion.create({
			data: {
				question: 'Do you have any allergies?',
				options: ['Yes', 'No', 'Not sure'],
				required: false,
			},
		})

		const response = await request(app.server)
			.get('/interview-questions')
			.set('Authorization', `Bearer ${token}`)
			.query({ page: 1 })

		expect(response.status).toEqual(200)
		expect(response.body.interviewQuestions).toHaveLength(2)
		expect(response.body.interviewQuestions[0]).toEqual(
			expect.objectContaining({
				question: expect.any(String),
				options: expect.any(Array),
				required: expect.any(Boolean),
			}),
		)
	})
})