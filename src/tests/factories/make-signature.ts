import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { SignatureProps } from '@domain/company/entities/interfaces/signature.type'
import { Signature } from '@domain/company/entities/signature'

export function makeSignature(
	override?: Partial<SignatureProps>,
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
