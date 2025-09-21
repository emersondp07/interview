import { createTriageSchema } from '@/application/interviewer/validators/create-triage.schema'
import { fetchClientTriagesParams } from '@/application/interviewer/validators/fetch-client-triages.schema'
import { fetchTriageByAppointmentParams } from '@/application/interviewer/validators/fetch-triage-by-appointment.schema'
import { updateTriageParams, updateTriageSchema } from '@/application/interviewer/validators/update-triage.schema'
import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { createTriage } from '../controllers/triage/create-triage'
import { fetchClientTriages } from '../controllers/triage/fetch-client-triages'
import { fetchTriageByAppointment } from '../controllers/triage/fetch-triage-by-appointment'
import { updateTriage } from '../controllers/triage/update-triage'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function triageRoutes(app: FastifyTypedInstance) {
	app.post(
		'/triages',
		{
			schema: {
				tags: ['Triage'],
				summary: 'Create a new triage',
				description: 'This route allows creating a new triage for a client.',
				body: createTriageSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.INTERVIEWER])],
		},
		createTriage,
	)

	app.get(
		'/clients/:clientId/triages',
		{
			schema: {
				tags: ['Triage'],
				summary: 'Fetch client triages',
				description: 'This route allows fetching all triages for a specific client.',
				params: fetchClientTriagesParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		fetchClientTriages,
	)

	app.put(
		'/triages/:triageId',
		{
			schema: {
				tags: ['Triage'],
				summary: 'Update a triage',
				description: 'This route allows updating a specific triage.',
				params: updateTriageParams,
				body: updateTriageSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.INTERVIEWER])],
		},
		updateTriage,
	)

	app.get(
		'/appointments/:appointmentId/triage',
		{
			schema: {
				tags: ['Triage'],
				summary: 'Fetch triage by appointment',
				description: 'This route allows fetching the triage associated with a specific appointment.',
				params: fetchTriageByAppointmentParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		fetchTriageByAppointment,
	)
}