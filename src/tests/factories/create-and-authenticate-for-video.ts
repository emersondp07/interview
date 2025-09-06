import type { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import type { ROLE } from '../../domain/administrator/entities/interfaces/adminitrator.type'
import { prisma } from '../../infra/database/prisma/prisma'
import { createAndAuthenticateClientInterviewer } from './create-and-authenticate-client-interviewer'

interface CreateAndAuthenticateForVideoResponse {
	tokenClient: string
	tokenInterviewer: string
	companyId: string
	interviewId: string
	clientId: string
	interviewerId: string
	doctorId: string
	patientId: string
	clientDocument: string
}

export async function createAndAuthenticateForVideo(
	app: FastifyInstance,
): Promise<CreateAndAuthenticateForVideoResponse> {
	const {
		tokenClient,
		tokenInterviewer,
		clientId,
		companyId,
		document,
		interviewId,
		signatureId,
	} = await createAndAuthenticateClientInterviewer(app)

	const { sub } = jwt.decode(tokenInterviewer) as {
		sub: string
		role: ROLE.INTERVIEWER
	}

	const interviewer = await prisma.interviewer.findUnique({
		where: {
			id: sub,
		},
	})

	return {
		tokenClient,
		tokenInterviewer,
		companyId,
		interviewId,
		clientId: clientId,
		interviewerId: interviewer?.id || '',
		doctorId: interviewer?.id || '',
		patientId: clientId,
		clientDocument: document,
	}
}
