import type { Contract } from '../../../company/entities/contract'

export interface ContractsRepository {
	create(contract: Contract): Promise<void>
}
