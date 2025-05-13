import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { SignatureProps } from '@/domain/company/enterprise/entities/interfaces/signature.type'
import { Signature } from '@/domain/company/enterprise/entities/signature'

export function makeSignature(
	override: Partial<SignatureProps> = {},
	id?: UniqueEntityID,
) {
	const company = Signature.create(
		{
			companyId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return company
}
