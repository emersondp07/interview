import type { Appointment } from '@/domain/client/entities/appointment'
import type { AppointmentsRepository } from '@/domain/client/repositories/appointments-repository'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
	public items: Appointment[] = []

	async create(appointment: Appointment): Promise<void> {
		this.items.push(appointment)
	}

	async findById(id: string): Promise<Appointment | null> {
		const appointment = this.items.find(
			(item) => item.id.toString() === id && !item.deletedAt,
		)
		return appointment || null
	}

	async findAll({ page }: PaginationParams): Promise<Appointment[]> {
		return this.items
			.filter((item) => !item.deletedAt)
			.slice((page - 1) * 10, page * 10)
	}

	async findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Appointment[] | null> {
		const filtered = this.items.filter(
			(item) => item.clientId.toString() === clientId && !item.deletedAt,
		)
		return filtered.slice((params.page - 1) * 10, params.page * 10)
	}

	async findByInterviewerId(
		interviewerId: string,
		params: PaginationParams,
	): Promise<Appointment[] | null> {
		const filtered = this.items.filter(
			(item) =>
				item.interviewerId?.toString() === interviewerId && !item.deletedAt,
		)
		return filtered.slice((params.page - 1) * 10, params.page * 10)
	}

	async update(appointment: Appointment): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.id.equals(appointment.id),
		)

		if (itemIndex >= 0) {
			this.items[itemIndex] = appointment
		}
	}

	async delete(appointment: Appointment): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.id.equals(appointment.id),
		)

		if (itemIndex >= 0) {
			this.items[itemIndex].cancel()
		}
	}
}
