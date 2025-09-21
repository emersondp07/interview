import { assignInterviewerToAppointmentParams, assignInterviewerToAppointmentSchema } from '@/application/client/validators/assign-interviewer-to-appointment.schema'
import { cancelAppointmentParams } from '@/application/client/validators/cancel-appointment.schema'
import { createAppointmentSchema } from '@/application/client/validators/create-appointment.schema'
import { fetchAppointmentsByClientParams } from '@/application/client/validators/fetch-appointments-by-client.schema'
import { updateAppointmentStatusParams, updateAppointmentStatusSchema } from '@/application/client/validators/update-appointment-status.schema'
import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { assignInterviewerToAppointment } from '../controllers/appointment/assign-interviewer-to-appointment'
import { cancelAppointment } from '../controllers/appointment/cancel-appointment'
import { createAppointment } from '../controllers/appointment/create-appointment'
import { fetchAppointmentsByClient } from '../controllers/appointment/fetch-appointments-by-client'
import { updateAppointmentStatus } from '../controllers/appointment/update-appointment-status'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function appointmentRoutes(app: FastifyTypedInstance) {
	app.post(
		'/appointments',
		{
			schema: {
				tags: ['Appointments'],
				summary: 'Create a new appointment',
				description: 'This route allows creating a new appointment for a client.',
				body: createAppointmentSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.CLIENT])],
		},
		createAppointment,
	)

	app.get(
		'/clients/:clientId/appointments',
		{
			schema: {
				tags: ['Appointments'],
				summary: 'Fetch appointments by client',
				description: 'This route allows fetching all appointments for a specific client.',
				params: fetchAppointmentsByClientParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER, ROLE.CLIENT])],
		},
		fetchAppointmentsByClient,
	)

	app.put(
		'/appointments/:appointmentId/status',
		{
			schema: {
				tags: ['Appointments'],
				summary: 'Update appointment status',
				description: 'This route allows updating the status of an appointment.',
				params: updateAppointmentStatusParams,
				body: updateAppointmentStatusSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.INTERVIEWER])],
		},
		updateAppointmentStatus,
	)

	app.put(
		'/appointments/:appointmentId/assign-interviewer',
		{
			schema: {
				tags: ['Appointments'],
				summary: 'Assign interviewer to appointment',
				description: 'This route allows assigning an interviewer to an appointment.',
				params: assignInterviewerToAppointmentParams,
				body: assignInterviewerToAppointmentSchema,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY])],
		},
		assignInterviewerToAppointment,
	)

	app.delete(
		'/appointments/:appointmentId',
		{
			schema: {
				tags: ['Appointments'],
				summary: 'Cancel an appointment',
				description: 'This route allows canceling an appointment.',
				params: cancelAppointmentParams,
			},
			onRequest: [verifyJWT, verifyUserRole([ROLE.COMPANY, ROLE.CLIENT])],
		},
		cancelAppointment,
	)
}