import { Appointment } from '@/domain/client/entities/appointment'
import {
	SPECIALTIES,
	STATUS_APPOINTMENT,
} from '@/domain/client/entities/interfaces/appointment.type'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { faker } from '@faker-js/faker'

export function makeAppointment(
	override: Partial<{
		status: STATUS_APPOINTMENT
		scheduledAt: Date
		clientId: UniqueEntityID
		interviewerId: UniqueEntityID
		specialty: SPECIALTIES
		triageId: UniqueEntityID
		interviewId: UniqueEntityID
	}> = {},
	id?: UniqueEntityID,
) {
	const appointment = Appointment.create(
		{
			status: STATUS_APPOINTMENT.SCHEDULED,
			scheduledAt: faker.date.future(),
			clientId: new UniqueEntityID(),
			specialty: SPECIALTIES.CLINICA_GERAL,
			...override,
		},
		id,
	)

	return appointment
}
