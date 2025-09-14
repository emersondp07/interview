import type { Company } from '@/domain/company/entities/company'
import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { PrismaCompanyMapper } from '@/infra/database/prisma/mappers/prisma-company-mapper'
import type { CompaniesRepository } from '@domain/administrator/repositories/companies-repository'
import type { Company as PrismaCompany } from '@prisma/client'

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

	async findByInteviewerId(interviewerId: string) {
		// For this in-memory implementation, we'll find a company by checking if the interviewer belongs to it
		// In the test, we create an interviewer with a companyId, so we find the company with that ID
		const company = this.items.find(
			(company) => company.id.toString() === interviewerId,
		)

		if (!company) {
			return null
		}

		return company ? PrismaCompanyMapper.toDomain(company) : null
	}

	async findByCustomerId(customerId: string) {
		const company = this.items.find(
			(company) => company.stripe_customer_id === customerId,
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
