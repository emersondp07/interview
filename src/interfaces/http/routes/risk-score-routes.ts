import { calculateRiskScoreParams, calculateRiskScoreSchema } from '@/application/interviewer/validators/calculate-risk-score.schema'
import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { calculateRiskScore } from '../controllers/risk-score/calculate-risk-score'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function riskScoreRoutes(app: FastifyTypedInstance) {
	app.post(
		'/clients/:clientId/risk-score',
		{
			schema: {
				tags: ['Risk Score'],
				summary: 'Calculate client risk score',
				description: 'This route calculates the risk score for a client based on vital signs and risk factors.',
				params: calculateRiskScoreParams,
				body: calculateRiskScoreSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		calculateRiskScore,
	)
}