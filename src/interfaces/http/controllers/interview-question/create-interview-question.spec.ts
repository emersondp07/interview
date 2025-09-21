import { app } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import request from 'supertest'

describe('Create Interview Question (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create interview question', async () => {
		const { token } = await createAndAuthenticateCompany(app)

		const response = await request(app.server)
			.post('/interview-questions')
			.set('Authorization', `Bearer ${token}`)
			.send({
				question: 'What is your current health status?',
				options: ['Excellent', 'Good', 'Fair', 'Poor'],
				required: true,
			})

		expect(response.status).toEqual(201)
		expect(response.body.interviewQuestion).toEqual(
			expect.objectContaining({
				question: 'What is your current health status?',
				options: ['Excellent', 'Good', 'Fair', 'Poor'],
				required: true,
			}),
		)
	})

	it('should not be able to create interview question without authentication', async () => {
		const response = await request(app.server)
			.post('/interview-questions')
			.send({
				question: 'What is your current health status?',
				options: ['Excellent', 'Good', 'Fair', 'Poor'],
				required: true,
			})

		expect(response.status).toEqual(401)
	})
})