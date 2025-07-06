import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { CompaniesRepository } from '@domain/administrator/repositories/companies-repository'
import type { Company } from '@domain/company/entities/company'
import { PrismaCompanyMapper } from '../prisma/mappers/prisma-company-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaCompaniesRepository implements CompaniesRepository {
	async findAll({ page }: PaginationParams) {
		const companies = await prisma.company.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})

		return companies.map(PrismaCompanyMapper.toDomain)
	}

	async findById(companyId: string) {
		const company = await prisma.company.findUnique({
			where: {
				id: companyId,
			},
		})

		return company ? PrismaCompanyMapper.toDomain(company) : null
	}

	async findByEmail(email: string): Promise<Company | null> {
		const company = await prisma.company.findUnique({
			where: {
				email: email,
			},
		})

		return company ? PrismaCompanyMapper.toDomain(company) : null
	}

	async create(company: Company) {
		const prismaCompany = PrismaCompanyMapper.toPrisma(company)

		await prisma.company.create({
			data: prismaCompany,
		})
	}
}
