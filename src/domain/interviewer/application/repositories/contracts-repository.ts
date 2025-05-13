import type { Contract } from '../../../company/enterprise/entities/contract'

export interface ContractsRepository {
	create(contract: Contract): Promise<void>
}
