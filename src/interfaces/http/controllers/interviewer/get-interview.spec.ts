import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Get Interview (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get an interview by id', async () => {
		const { tokenInterviewer, interviewId } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.get(`/get-interview/${interviewId}`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send()

		expect(response.status).toEqual(200)
	})

	it('should return 404 when interview not found', async () => {
		const { tokenInterviewer } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.get('/get-interview/invalid-interview-id')
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send()

		expect(response.status).toEqual(404)
	})

	it('should return 401 when not authenticated', async () => {
		const response = await request(app.server)
			.get('/get-interview/any-interview-id')
			.send()

		expect(response.status).toEqual(401)
	})
})
