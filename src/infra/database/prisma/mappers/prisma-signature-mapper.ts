import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { STATUS_SIGNATURE } from '@/domain/company/enterprise/entities/interfaces/signature.type'
import { Signature } from '@/domain/company/enterprise/entities/signature'
import type {
	Signature as PrismaSignature,
	STATUS_SIGNATURE as PrismaStatusSignature,
} from '@prisma/client'

export class PrismaSignatureMapper {
	static toPrisma(signature: Signature): PrismaSignature {
		return {
			id: signature.id.toString(),
			company_id: signature.companyId.toString(),
			plan_id: signature.planId.toString(),
			end_validity: signature.endValidity ?? null,
			start_validity: signature.startValidity,
			status: signature.status as PrismaStatusSignature,
		}
	}

	static toDomain(raw: PrismaSignature): Signature {
		return Signature.create(
			{
				companyId: new UniqueEntityID(raw.company_id),
				planId: new UniqueEntityID(raw.plan_id),
				startValidity: raw.start_validity,
				endValidity: raw.end_validity ?? undefined,
				status: raw.status as STATUS_SIGNATURE,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
