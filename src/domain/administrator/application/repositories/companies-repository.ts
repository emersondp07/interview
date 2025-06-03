import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Company } from '../../../company/enterprise/entities/company'

export interface CompaniesRepository {
	create(company: Company): Promise<void>
	findAll(params: PaginationParams): Promise<Company[] | null>
	findById(companyId: string): Promise<Company | null>
	findByEmail(email: string): Promise<Company | null>
}
