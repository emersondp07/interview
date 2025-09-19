import type { Appointment } from '@/domain/client/entities/appointment'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { PrismaAppointmentMapper } from '../prisma/mappers/prisma-appointment-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaAppointmentsRepository implements AppointmentsRepository {
	async findAll({ page }: PaginationParams) {
		const appointments = await prisma.appointment.findMany({
			where: {
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return appointments.map(PrismaAppointmentMapper.toDomain)
	}

	async findById(appointmentId: string) {
		const appointment = await prisma.appointment.findUnique({
			where: {
				id: appointmentId,
			},
		})

		return appointment ? PrismaAppointmentMapper.toDomain(appointment) : null
	}

	async findByClientId(clientId: string, { page }: PaginationParams) {
		const appointments = await prisma.appointment.findMany({
			where: {
				client_id: clientId,
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				scheduled_at: 'desc',
			},
		})

		return appointments.map(PrismaAppointmentMapper.toDomain)
	}

	async findByInterviewerId(interviewerId: string, { page }: PaginationParams) {
		const appointments = await prisma.appointment.findMany({
			where: {
				interviewer_id: interviewerId,
				deleted_at: null,
			},
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				scheduled_at: 'desc',
			},
		})

		return appointments.map(PrismaAppointmentMapper.toDomain)
	}

	async create(appointment: Appointment) {
		const prismaAppointment = PrismaAppointmentMapper.toPrisma(appointment)

		await prisma.appointment.create({
			data: prismaAppointment,
		})
	}

	async update(appointment: Appointment) {
		await prisma.appointment.update({
			where: {
				id: appointment.id.toString(),
			},
			data: PrismaAppointmentMapper.toPrisma(appointment),
		})
	}

	async delete(appointment: Appointment) {
		await prisma.appointment.update({
			where: {
				id: appointment.id.toString(),
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
