import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { STATUS_SIGNATURE } from '@domain/company/entities/interfaces/signature.type'
import { Signature } from '@domain/company/entities/signature'
import type {
	Signature as PrismaSignature,
	STATUS_SIGNATURE as PrismaStatusSignature,
} from '@prisma/client'

export class PrismaSignatureMapper {
	static toPrisma(signature: Signature): PrismaSignature {
		return {
			id: signature.id.toString(),
			plan_id: signature.planId.toString(),
			end_validity: signature.endValidity ?? null,
			start_validity: signature.startValidity,
			status: signature.status as PrismaStatusSignature,
			stripe_subscription_id: signature.stripeSubscriptionId ?? null,
			stripe_subscription_status: signature.stripeSubscriptionStatus ?? null,
		}
	}

	static toDomain(raw: PrismaSignature): Signature {
		return Signature.create(
			{
				planId: new UniqueEntityID(raw.plan_id),
				startValidity: raw.start_validity,
				endValidity: raw.end_validity ?? undefined,
				status: raw.status as STATUS_SIGNATURE,
				stripeSubscriptionId: raw.stripe_subscription_id ?? undefined,
				stripeSubscriptionStatus: raw.stripe_subscription_status ?? undefined,
				companyId: new UniqueEntityID(raw.id),
			},
			new UniqueEntityID(raw.id),
		)
	}
}
