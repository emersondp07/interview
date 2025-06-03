import type { AdministratorsRepository } from '@/domain/administrator/application/repositories/administrators-repository'
import type { Administrator } from '@/domain/administrator/enterprise/entities/administrator'

export class InMemoryAdministratorsRepository
	implements AdministratorsRepository
{
	public items: Administrator[] = []

	async findByEmail(email: string) {
		const administrator = this.items.find((company) => company.email === email)

		if (!administrator) {
			return null
		}

		return administrator
	}

	async create(administrator: Administrator) {
		this.items.push(administrator)
	}
}
