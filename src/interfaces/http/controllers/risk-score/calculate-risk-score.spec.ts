import { app } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import request from 'supertest'

describe('Calculate Risk Score (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to calculate risk score', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.post(`/clients/${clientId}/risk-score`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				vitalSigns: {
					systolicBP: 120,
					diastolicBP: 80,
					heartRate: 75,
					temperature: 36.5,
					respiratoryRate: 16,
					oxygenSaturation: 98,
				},
				riskFactors: {
					age: 45,
					hasChronicConditions: false,
					smokingStatus: 'never',
					bmi: 25.0,
					medicationCount: 2,
					symptomSeverity: 3,
				},
			})

		expect(response.status).toEqual(200)
		expect(response.body).toEqual(
			expect.objectContaining({
				riskScore: expect.objectContaining({
					score: expect.any(Number),
					level: expect.any(String),
					factors: expect.any(Array),
					priority: expect.any(Number),
					recommendedAction: expect.any(String),
					color: expect.any(String),
				}),
			}),
		)
	})

	it('should be able to calculate high risk score', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.post(`/clients/${clientId}/risk-score`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				vitalSigns: {
					systolicBP: 190, // High blood pressure
					diastolicBP: 110, // High blood pressure
					heartRate: 130, // High heart rate
					temperature: 39.5, // Fever
					respiratoryRate: 35, // High respiratory rate
					oxygenSaturation: 88, // Low oxygen
				},
				riskFactors: {
					age: 75, // Elderly
					hasChronicConditions: true, // Has chronic conditions
					smokingStatus: 'current', // Current smoker
					bmi: 38.0, // Severe obesity
					medicationCount: 8, // Multiple medications
					symptomSeverity: 9, // Severe symptoms
				},
			})

		expect(response.status).toEqual(200)
		expect(response.body.riskScore.level).toBe('CRITICAL')
		expect(response.body.riskScore.score).toBeGreaterThan(75)
		expect(response.body.riskScore.priority).toBe(1)
		expect(response.body.riskScore.factors.length).toBeGreaterThan(5)
	})

	it('should not be able to calculate risk score without authentication', async () => {
		const response = await request(app.server)
			.post('/clients/some-client-id/risk-score')
			.send({
				vitalSigns: {
					systolicBP: 120,
					diastolicBP: 80,
					heartRate: 75,
					temperature: 36.5,
					respiratoryRate: 16,
					oxygenSaturation: 98,
				},
				riskFactors: {
					age: 45,
					hasChronicConditions: false,
					smokingStatus: 'never',
					medicationCount: 2,
					symptomSeverity: 3,
				},
			})

		expect(response.status).toEqual(401)
	})

	it('should return validation error for invalid vital signs', async () => {
		const { tokenInterviewer, clientId } =
			await createAndAuthenticateClientInterviewer(app)

		const response = await request(app.server)
			.post(`/clients/${clientId}/risk-score`)
			.set('Authorization', `Bearer ${tokenInterviewer}`)
			.send({
				vitalSigns: {
					systolicBP: 60, // Invalid - below minimum for zod (70)
					diastolicBP: 80,
					heartRate: 75,
					temperature: 36.5,
					respiratoryRate: 16,
					oxygenSaturation: 98,
				},
				riskFactors: {
					age: 45,
					hasChronicConditions: false,
					smokingStatus: 'never',
					medicationCount: 2,
					symptomSeverity: 3,
				},
			})

		expect(response.status).toEqual(400)
	})
})