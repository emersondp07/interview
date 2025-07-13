import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import { Company } from '@domain/company/entities/company'
import type {
	Company as PrismaCompany,
	ROLE as PrismaRole,
} from '@prisma/client'
import { Signature } from '../../../../domain/company/entities/signature'

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
			signature_id: company.signature ? company.signature?.id.toString() : '',
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
				signature: raw.signature_id
					? Signature.create(
							{
								companyId: new UniqueEntityID(raw.id),
								planId: new UniqueEntityID(raw.plan_id),
							},
							new UniqueEntityID(raw.signature_id),
						)
					: undefined,
				stripeCustomerId: raw.stripe_customer_id ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
