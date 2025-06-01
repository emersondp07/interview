import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { CompaniesRepository } from '@/domain/administrator/application/repositories/companies-repository'
import type { Company } from '@/domain/company/enterprise/entities/company'
import { prisma } from '../prisma/prisma'

export class PrismaCompaniesRepository implements CompaniesRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.company.findMany({
			select: {
				id: true,
				corporate_reason: true,
				cnpj: true,
				email: true,
				phone: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Company[]
	}

	async findById(companyId: string) {
		return prisma.company.findUnique({
			where: {
				id: companyId,
			},
			select: {
				id: true,
				corporate_reason: true,
				cnpj: true,
				email: true,
				phone: true,
			},
		}) as unknown as Company
	}

	async findByCnpj(cnpj: string): Promise<Company | null> {
		return prisma.company.findUnique({
			where: {
				cnpj,
			},
			select: {
				id: true,
				corporate_reason: true,
				cnpj: true,
				email: true,
				phone: true,
			},
		}) as unknown as Company
	}

	async create(company: Company) {
		await prisma.company.create({
			data: {
				id: company.id.toString(),
				corporate_reason: company.corporateReason,
				cnpj: company.cnpj,
				email: company.email,
				phone: company.phone,
				password: company.password,
				plan_id: company.planId,
				role: company.role,
			},
		})
	}
}
