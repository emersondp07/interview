import type { ContractsRepository } from '@/domain/company/application/repositories/contracts-repository'
import type { Contract } from '@/domain/company/enterprise/entities/contract'

export class InMemoryContractsRepository implements ContractsRepository {
	public items: Contract[] = []

	async create(contract: Contract) {
		this.items.push(contract)
	}
}
