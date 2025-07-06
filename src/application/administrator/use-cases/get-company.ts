import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Company } from '@/domain/company/entities/company'
import { type Either, success } from '@/domain/core/either'

interface GetCompanyUseCaseRequest {
	companyId: string
}

type GetCompanyUseCaseResponse = Either<null, { company: Company | null }>

export class GetCompanyUseCase {
	constructor(private companiesRepository: CompaniesRepository) {}

	async execute({
		companyId,
	}: GetCompanyUseCaseRequest): Promise<GetCompanyUseCaseResponse> {
		const company = await this.companiesRepository.findById(companyId)

		return success({ company })
	}
}
