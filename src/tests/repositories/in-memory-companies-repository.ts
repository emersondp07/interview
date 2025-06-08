import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { CompaniesRepository } from '@/domain/administrator/application/repositories/companies-repository'
import type { Company as PrismaCompany } from '@prisma/client'
import type { Company } from '../../domain/company/enterprise/entities/company'
import { PrismaCompanyMapper } from '../../infra/database/prisma/mappers/prisma-company-mapper'

export class InMemoryCompaniesRepository implements CompaniesRepository {
	public items: PrismaCompany[] = []

	async findAll({ page }: PaginationParams) {
		const companies = this.items.slice((page - 1) * 10, page * 10)

		return companies.map(PrismaCompanyMapper.toDomain)
	}

	async findById(companyId: string) {
		const company = this.items.find(
			(company) => company.id.toString() === companyId,
		)

		if (!company) {
			return null
		}

		return company ? PrismaCompanyMapper.toDomain(company) : null
	}

	async findByEmail(email: string) {
		const company = this.items.find((company) => company.email === email)

		if (!company) {
			return null
		}

		return company ? PrismaCompanyMapper.toDomain(company) : null
	}

	async create(company: Company) {
		const prismaCompany = PrismaCompanyMapper.toPrisma(company)

		this.items.push(prismaCompany)
	}
}
