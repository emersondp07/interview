import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Contract } from '@domain/company/entities/contract'
import type { Contract as PrismaContract } from '@prisma/client'

export class PrismaContractMapper {
	static toPrisma(contract: Contract): PrismaContract {
		return {
			id: contract.id.toString(),
			title: contract.title,
			description: contract.description,
			image_url: contract.imageUrl,
			company_id: contract.companyId.toString(),
			created_at: contract.createdAt,
			updated_at: contract.updatedAt,
			deleted_at: contract.deletedAt ?? null,
		}
	}

	static toDomain(raw: PrismaContract): Contract {
		return Contract.create(
			{
				title: raw.title,
				description: raw.description,
				imageUrl: raw.image_url,
				companyId: new UniqueEntityID(raw.company_id),
				createdAt: raw.created_at,
				updatedAt: raw.updated_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
