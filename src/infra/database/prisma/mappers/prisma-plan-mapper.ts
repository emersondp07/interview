import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Plan } from '@domain/administrator/entities/plan'
import type { Plan as PrismaPlan } from '@prisma/client'

export class PrismaPlanMapper {
	static toPrisma(plan: Plan): PrismaPlan {
		return {
			id: plan.id.toString(),
			name: plan.name,
			price: plan.price,
			interview_limit: plan.interviewLimit,
			description: plan.description,
			created_at: plan.createdAt,
			updated_at: plan.updatedAt,
			deleted_at: plan.deletedAt ?? null,
			stripe_product_id: plan.stripeProductId ?? null,
			stripe_price_id: plan.stripePriceId ?? null,
		}
	}

	static toDomain(raw: PrismaPlan): Plan {
		return Plan.create(
			{
				name: raw.name,
				price: raw.price,
				interviewLimit: raw.interview_limit,
				description: raw.description,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at,
				deletedAt: raw.deleted_at ?? undefined,
				stripeProductId: raw.stripe_product_id,
				stripePriceId: raw.stripe_price_id ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
