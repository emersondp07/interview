import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Contract } from '@domain/company/entities/contract'
import type { ContractProps } from '@domain/company/entities/interfaces/contract.type'

export function makeContract(
	override?: Partial<ContractProps>,
	id?: UniqueEntityID,
) {
	const contract = Contract.create(
		{
			title: 'Example Contract',
			description: 'Example description',
			imageUrl: 'https://example.com/image.jpg',
			companyId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return contract
}
