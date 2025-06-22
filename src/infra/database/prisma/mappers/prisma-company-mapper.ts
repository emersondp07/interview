import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { Company } from '@/domain/company/enterprise/entities/company'
import type {
	Company as PrismaCompany,
	ROLE as PrismaRole,
} from '@prisma/client'

export class PrismaCompanyMapper {
	static toPrisma(company: Company): PrismaCompany {
		return {
			id: company.id.toString(),
			corporate_reason: company.corporateReason,
			cnpj: company.cnpj,
			phone: company.phone,
			email: company.email,
			password: company.password,
			role: company.role as PrismaRole,
			plan_id: company.planId?.toString(),
			created_at: company.createdAt,
			updated_at: company.updatedAt,
			deleted_at: company.deletedAt ?? null,
			stripe_customer_id: company.stripeCustomerId ?? null,
		}
	}

	static toDomain(raw: PrismaCompany): Company {
		return Company.create(
			{
				corporateReason: raw.corporate_reason,
				cnpj: raw.cnpj,
				phone: raw.phone,
				email: raw.email,
				password: raw.password,
				role: raw.role as ROLE.COMPANY,
				planId: raw.plan_id,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at,
				stripeCustomerId: raw.stripe_customer_id ?? undefined
			},
			new UniqueEntityID(raw.id),
		)
	}
}
