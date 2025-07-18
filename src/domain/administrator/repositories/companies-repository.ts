import type { Company } from '../../company/entities/company'
import type { PaginationParams } from '../../core/repositories/pagination-params'

export interface CompaniesRepository {
	create(company: Company): Promise<void>
	findAll(params: PaginationParams): Promise<Company[] | null>
	findById(companyId: string): Promise<Company | null>
	findByCustomerId(customerId: string): Promise<Company | null>
	findByEmail(email: string): Promise<Company | null>
}
