import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { CompaniesRepository } from '@/domain/administrator/application/repositories/companies-repository'
import type { Company } from '../../domain/company/enterprise/entities/company'

export class InMemoryCompaniesRepository implements CompaniesRepository {
	public items: Company[] = []

	async findAll({ page }: PaginationParams) {
		const companies = this.items.slice((page - 1) * 10, page * 10)

		return companies
	}

	async findById(companyId: string) {
		const company = this.items.find(
			(company) => company.id.toString() === companyId,
		)

		if (!company) {
			return null
		}

		return company
	}

	async findByCnpj(cnpj: string) {
		const company = this.items.find((company) => company.cnpj === cnpj)

		if (!company) {
			return null
		}

		return company
	}

	async create(company: Company) {
		this.items.push(company)
	}
}
