import { type Either, success } from '@/core/either'
import type { Company } from '../../../company/enterprise/entities/company'
import type { CompaniesRepository } from '../repositories/companies-repository'

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
