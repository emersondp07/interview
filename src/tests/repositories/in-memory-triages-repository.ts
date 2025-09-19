import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

export class InMemoryTriagesRepository implements TriagesRepository {
	public items: Triage[] = []
	public appointmentTriageMap: Map<string, string> = new Map()

	async create(triage: Triage): Promise<void> {
		this.items.push(triage)
	}

	async findById(id: string): Promise<Triage | null> {
		const triage = this.items.find(
			(item) => item.id.toString() === id && !item.deletedAt,
		)
		return triage || null
	}

	async findAll({ page }: PaginationParams): Promise<Triage[]> {
		return this.items
			.filter((item) => !item.deletedAt)
			.slice((page - 1) * 10, page * 10)
	}

	async findByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Triage[] | null> {
		const filtered = this.items.filter(
			(item) => item.clientId.toString() === clientId && !item.deletedAt,
		)
		return filtered.slice((params.page - 1) * 10, params.page * 10)
	}

	async findByAppointmentId(appointmentId: string): Promise<Triage | null> {
		const triageId = this.appointmentTriageMap.get(appointmentId)
		if (!triageId) {
			return null
		}

		const triage = this.items.find(
			(item) => item.id.toString() === triageId && !item.deletedAt,
		)
		return triage || null
	}

	setAppointmentTriageMapping(appointmentId: string, triageId: string): void {
		this.appointmentTriageMap.set(appointmentId, triageId)
	}

	async update(triage: Triage): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id.equals(triage.id))

		if (itemIndex >= 0) {
			this.items[itemIndex] = triage
		}
	}

	async delete(triage: Triage): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id.equals(triage.id))

		if (itemIndex >= 0) {
			this.items[itemIndex].delete()
		}
	}
}
