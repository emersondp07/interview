import { type Either, success } from '@/core/either'
import type { Company } from '../../../company/enterprise/entities/company'
import type { CompaniesRepository } from '../repositories/companies-repository'

interface FetchCompaniesUseCaseRequest {
	page: number
}

type FetchCompaniesUseCaseResponse = Either<
	null,
	{ companies: Company[] | null }
>

export class FetchCompaniesUseCase {
	constructor(private companiesRepository: CompaniesRepository) {}

	async execute({
		page,
	}: FetchCompaniesUseCaseRequest): Promise<FetchCompaniesUseCaseResponse> {
		const companies = await this.companiesRepository.findAll({ page })

		return success({ companies })
	}
}
