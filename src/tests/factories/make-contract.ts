import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Contract } from '@/domain/company/enterprise/entities/contract'
import type { ContractProps } from '@/domain/company/enterprise/entities/interfaces/contract.type'

export function makeContract(
	override: Partial<ContractProps> = {},
	id?: UniqueEntityID,
) {
	const contract = Contract.create(
		{
			title: 'Example Contract',
			description: 'Example description',
			imageId: 'url de imagem salva',
			companyId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return contract
}
